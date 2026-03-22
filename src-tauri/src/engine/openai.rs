use crate::engine::{AIProvider, ChatMessage, ChatResponse, TokenUsage, ToolCall, ToolFunction};
use async_trait::async_trait;
use serde_json::json;

pub struct OpenAIProvider {
    pub api_key: String,
}

#[async_trait]
impl AIProvider for OpenAIProvider {
    fn get_name(&self) -> &str {
        "openai"
    }

    async fn call(&self, model: &str, messages: Vec<ChatMessage>, tools: Option<Vec<serde_json::Value>>) -> Result<ChatResponse, String> {
        let client = reqwest::Client::new();

        let body = json!({
            "model": model,
            "messages": messages,
            "tools": tools,
            "tool_choice": if tools.is_some() { Some("auto") } else { None }
        });

        let resp = client.post("https://api.openai.com/v1/chat/completions")
            .header("Authorization", format!("Bearer {}", self.api_key))
            .json(&body)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        if !resp.status().is_success() {
            let error_text = resp.text().await.unwrap_or_default();
            return Err(format!("OpenAI API error: {} - {}", resp.status(), error_text));
        }

        let result: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;

        let choice = &result["choices"][0]["message"];
        let content = choice["content"].as_str().map(|s| s.to_string());

        let tool_calls = choice["tool_calls"].as_array().map(|calls| {
            calls.iter().map(|c| {
                ToolCall {
                    id: c["id"].as_str().unwrap_or_default().to_string(),
                    r#type: c["type"].as_str().unwrap_or_default().to_string(),
                    function: ToolFunction {
                        name: c["function"]["name"].as_str().unwrap_or_default().to_string(),
                        arguments: c["function"]["arguments"].as_str().unwrap_or_default().to_string(),
                    }
                }
            }).collect()
        });

        let usage = TokenUsage {
            prompt_tokens: result["usage"]["prompt_tokens"].as_u64().unwrap_or(0) as u32,
            completion_tokens: result["usage"]["completion_tokens"].as_u64().unwrap_or(0) as u32,
            total_tokens: result["usage"]["total_tokens"].as_u64().unwrap_or(0) as u32,
        };

        Ok(ChatResponse {
            content,
            tool_calls,
            usage,
        })
    }
}
