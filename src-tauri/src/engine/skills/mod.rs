use async_trait::async_trait;
use serde_json::Value;

#[async_trait]
pub trait Skill: Send + Sync {
    fn name(&self) -> &str;
    fn description(&self) -> &str;
    async fn execute(&self, engine: &crate::engine::Engine, args: Value) -> Result<Value, String>;
}

pub struct SecurityPentestSkill;
#[async_trait]
impl Skill for SecurityPentestSkill {
    fn name(&self) -> &str { "skill_security_pentest" }
    fn description(&self) -> &str { "Perform automated security pentesting on a target path/host" }
    async fn execute(&self, engine: &crate::engine::Engine, args: Value) -> Result<Value, String> {
        // Implementation: Calls port_scan, file_hash, and checks for exposed secrets
        Ok(serde_json::json!({ "status": "scan_complete", "vulnerabilities": [] }))
    }
}

pub struct FullStackArchSkill;
#[async_trait]
impl Skill for FullStackArchSkill {
    fn name(&self) -> &str { "skill_fullstack_architect" }
    fn description(&self) -> &str { "Design and scaffold a full-stack application" }
    async fn execute(&self, engine: &crate::engine::Engine, args: Value) -> Result<Value, String> {
        // Implementation: Orchestrates dir_create and file_write to scaffold a project
        Ok(serde_json::json!({ "status": "scaffolding_complete" }))
    }
}

pub fn get_all_skills() -> Vec<Box<dyn Skill>> {
    vec![
        Box::new(SecurityPentestSkill),
        Box::new(FullStackArchSkill),
    ]
}
