use crate::engine::Tool;
use async_trait::async_trait;
use serde_json::{json, Value};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use uuid::Uuid;

pub struct MemoryEntry {
    pub id: Uuid,
    pub content: String,
    pub metadata: Value,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

pub struct VectorMemory {
    entries: Arc<Mutex<HashMap<Uuid, MemoryEntry>>>,
}

impl VectorMemory {
    pub fn new() -> Self {
        Self {
            entries: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub async fn add(&self, content: String, metadata: Value) -> Uuid {
        let id = Uuid::new_v4();
        let entry = MemoryEntry {
            id,
            content,
            metadata,
            timestamp: chrono::Utc::now(),
        };
        self.entries.lock().await.insert(id, entry);
        id
    }

    pub async fn search(&self, _query: &str) -> Vec<MemoryEntry> {
        // Simple search for now, will be expanded with actual vector embeddings
        self.entries.lock().await.values().map(|e| MemoryEntry {
            id: e.id,
            content: e.content.clone(),
            metadata: e.metadata.clone(),
            timestamp: e.timestamp,
        }).collect()
    }
}

pub struct MemoryAddTool {
    pub memory: Arc<VectorMemory>,
}

#[async_trait]
impl Tool for MemoryAddTool {
    fn name(&self) -> &str { "mem_add" }
    fn description(&self) -> &str { "Add a memory entry to the long-term vector storage" }
    fn parameters(&self) -> Value { json!({ "type": "object", "properties": { "content": { "type": "string" }, "metadata": { "type": "object" } }, "required": ["content"] }) }
    async fn execute(&self, args: Value) -> Result<Value, String> {
        let content = args["content"].as_str().ok_or("Content required")?;
        let metadata = args["metadata"].clone();
        let id = self.memory.add(content.to_string(), metadata).await;
        Ok(json!({ "id": id }))
    }
}

pub struct MemorySearchTool {
    pub memory: Arc<VectorMemory>,
}

#[async_trait]
impl Tool for MemorySearchTool {
    fn name(&self) -> &str { "mem_search" }
    fn description(&self) -> &str { "Search long-term vector memory for relevant context" }
    fn parameters(&self) -> Value { json!({ "type": "object", "properties": { "query": { "type": "string" } }, "required": ["query"] }) }
    async fn execute(&self, args: Value) -> Result<Value, String> {
        let query = args["query"].as_str().ok_or("Query required")?;
        let entries = self.memory.search(query).await;
        let results: Vec<Value> = entries.iter().map(|e| {
            json!({ "id": e.id, "content": e.content, "timestamp": e.timestamp.to_rfc3339() })
        }).collect();
        Ok(json!(results))
    }
}
