pub mod openai;
pub mod anthropic;
pub mod tools;
pub mod skills;
pub mod memory;

use serde::{Deserialize, Serialize};
use async_trait::async_trait;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
    pub tool_calls: Option<Vec<ToolCall>>,
    pub tool_call_id: Option<String>,
    pub name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolCall {
    pub id: String,
    pub r#type: String,
    pub function: ToolFunction,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolFunction {
    pub name: String,
    pub arguments: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChatResponse {
    pub content: Option<String>,
    pub tool_calls: Option<Vec<ToolCall>>,
    pub usage: TokenUsage,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TokenUsage {
    pub prompt_tokens: u32,
    pub completion_tokens: u32,
    pub total_tokens: u32,
}

#[async_trait]
pub trait AIProvider: Send + Sync {
    async fn call(&self, model: &str, messages: Vec<ChatMessage>, tools: Option<Vec<serde_json::Value>>) -> Result<ChatResponse, String>;
    fn get_name(&self) -> &str;
}

#[async_trait]
pub trait Tool: Send + Sync {
    fn name(&self) -> &str;
    fn description(&self) -> &str;
    fn parameters(&self) -> serde_json::Value;
    async fn execute(&self, args: serde_json::Value) -> Result<serde_json::Value, String>;
}

pub struct Engine {
    providers: HashMap<String, Box<dyn AIProvider>>,
    tools: HashMap<String, Box<dyn Tool>>,
    skills: HashMap<String, Box<dyn skills::Skill>>,
    pub memory: Arc<memory::VectorMemory>,
}

impl Engine {
    pub fn new() -> Self {
        let memory = Arc::new(memory::VectorMemory::new());
        let mut engine = Self {
            providers: HashMap::new(),
            tools: HashMap::new(),
            skills: HashMap::new(),
            memory: memory.clone(),
        };
        // Register default tools and skills
        engine.register_defaults(memory);
        engine
    }

    fn register_defaults(&mut self, memory: Arc<memory::VectorMemory>) {
        for tool in tools::get_all_tools() {
            self.register_tool(tool);
        }
        for skill in skills::get_all_skills() {
            self.register_skill(skill);
        }
        // Register memory tools
        self.register_tool(Box::new(memory::MemoryAddTool { memory: memory.clone() }));
        self.register_tool(Box::new(memory::MemorySearchTool { memory: memory.clone() }));
    }

    pub fn register_provider(&mut self, name: &str, provider: Box<dyn AIProvider>) {
        self.providers.insert(name.to_string(), provider);
    }

    pub fn register_tool(&mut self, tool: Box<dyn Tool>) {
        self.tools.insert(tool.name().to_string(), tool);
    }

    pub fn register_skill(&mut self, skill: Box<dyn skills::Skill>) {
        self.skills.insert(skill.name().to_string(), skill);
    }

    pub async fn chat_step(&self, provider_name: &str, model: &str, messages: Vec<ChatMessage>) -> Result<ChatResponse, String> {
        let provider = self.providers.get(provider_name).ok_or_else(|| format!("Provider '{}' not found", provider_name))?;

        let tool_defs: Vec<serde_json::Value> = self.tools.values().map(|t| {
            serde_json::json!({
                "type": "function",
                "function": {
                    "name": t.name(),
                    "description": t.description(),
                    "parameters": t.parameters()
                }
            })
        }).collect();

        let mut all_defs = tool_defs;
        for s in self.skills.values() {
            all_defs.push(serde_json::json!({
                "type": "function",
                "function": {
                    "name": s.name(),
                    "description": s.description(),
                    "parameters": { "type": "object", "properties": {}, "additionalProperties": true }
                }
            }));
        }

        provider.call(model, messages, if all_defs.is_empty() { None } else { Some(all_defs) }).await
    }

    pub async fn execute_tool(&self, name: &str, args: &str) -> Result<serde_json::Value, String> {
        if name.starts_with("skill_") {
            let skill = self.skills.get(name).ok_or_else(|| format!("Skill '{}' not found", name))?;
            let parsed_args: serde_json::Value = serde_json::from_str(args).map_err(|e| format!("Invalid JSON arguments: {}", e))?;
            return skill.execute(self, parsed_args).await;
        }

        let tool = self.tools.get(name).ok_or_else(|| format!("Tool '{}' not found", name))?;
        let parsed_args: serde_json::Value = serde_json::from_str(args).map_err(|e| format!("Invalid JSON arguments: {}", e))?;
        tool.execute(parsed_args).await
    }
}
