use crate::engine::{AIProvider, ChatMessage, ChatResponse, TokenUsage, ToolCall, ToolFunction};
use async_trait::async_trait;
use serde_json::json;

pub struct AnthropicProvider {
    pub api_key: String,
}

#[async_trait]
impl AIProvider for AnthropicProvider {
    fn get_name(&self) -> &str {
        "anthropic"
    }

    async fn call(&self, model: &str, messages: Vec<ChatMessage>, tools: Option<Vec<serde_json::Value>>) -> Result<ChatResponse, String> {
        let client = reqwest::Client::new();

        let anthropic_tools = tools.map(|ts| {
            ts.iter().map(|t| {
                let func = &t["function"];
                json!({
                    "name": func["name"],
                    "description": func["description"],
                    "input_schema": func["parameters"]
                })
            }).collect::<Vec<_>>()
        });

        let system = messages.iter()
            .find(|m| m.role == "system")
            .map(|m| m.content.clone());

        let chat_messages: Vec<serde_json::Value> = messages.iter()
            .filter(|m| m.role != "system")
            .map(|m| {
                let mut content = vec![json!({ "type": "text", "text": m.content })];

                if let Some(tool_calls) = &m.tool_calls {
                    for tc in tool_calls {
                        content.push(json!({
                            "type": "tool_use",
                            "id": tc.id,
                            "name": tc.function.name,
                            "input": serde_json::from_str::<serde_json::Value>(&tc.function.arguments).unwrap_or(json!({}))
                        }));
                    }
                }

                if m.role == "tool" {
                    json!({
                        "role": "user",
                        "content": [{
                            "type": "tool_result",
                            "tool_use_id": m.tool_call_id,
                            "content": m.content
                        }]
                    })
                } else {
                    json!({
                        "role": m.role,
                        "content": content
                    })
                }
            }).collect();

        let mut body = json!({
            "model": model,
            "messages": chat_messages,
            "max_tokens": 4096,
        });

        if let Some(s) = system {
            body["system"] = json!(s);
        }
        if let Some(ts) = anthropic_tools {
            body["tools"] = json!(ts);
        }

        let resp = client.post("https://api.anthropic.com/v1/messages")
            .header("x-api-key", &self.api_key)
            .header("anthropic-version", "2023-06-01")
            .json(&body)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        if !resp.status().is_success() {
            let error_text = resp.text().await.unwrap_or_default();
            return Err(format!("Anthropic API error: {} - {}", resp.status(), error_text));
        }

        let result: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;

        let mut content = String::new();
        let mut tool_calls = Vec::new();

        if let Some(content_parts) = result["content"].as_array() {
            for part in content_parts {
                if part["type"] == "text" {
                    content.push_str(part["text"].as_str().unwrap_or_default());
                } else if part["type"] == "tool_use" {
                    tool_calls.push(ToolCall {
                        id: part["id"].as_str().unwrap_or_default().to_string(),
                        r#type: "function".to_string(),
                        function: ToolFunction {
                            name: part["name"].as_str().unwrap_or_default().to_string(),
                            arguments: part["input"].to_string(),
                        }
                    });
                }
            }
        }

        let usage = TokenUsage {
            prompt_tokens: result["usage"]["input_tokens"].as_u64().unwrap_or(0) as u32,
            completion_tokens: result["usage"]["output_tokens"].as_u64().unwrap_or(0) as u32,
            total_tokens: (result["usage"]["input_tokens"].as_u64().unwrap_or(0) + result["usage"]["output_tokens"].as_u64().unwrap_or(0)) as u32,
        };

        Ok(ChatResponse {
            content: if content.is_empty() { None } else { Some(content) },
            tool_calls: if tool_calls.is_empty() { None } else { Some(tool_calls) },
            usage,
        })
    }
}
