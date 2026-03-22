// VoiceDev Tauri Desktop App
// Built with Tauri v2

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod engine;

use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use engine::{Engine, ChatMessage, OpenAIProvider, AnthropicProvider, AIProvider};
use std::sync::Arc;
use tokio::sync::Mutex;

struct AppState {
    engine: Mutex<Engine>,
}

#[tauri::command]
async fn chat(
    state: tauri::State<'_, Arc<AppState>>,
    provider: String,
    model: String,
    api_key: String,
    messages: Vec<ChatMessage>
) -> Result<engine::ChatResponse, String> {
    let mut engine = state.engine.lock().await;

    // Ensure provider is registered with latest API key
    if provider == "openai" {
        engine.register_provider("openai", Box::new(OpenAIProvider { api_key }));
    } else if provider == "anthropic" {
        engine.register_provider("anthropic", Box::new(AnthropicProvider { api_key }));
    }

    engine.chat_step(&provider, &model, messages).await
}

#[tauri::command]
async fn execute_tool(
    state: tauri::State<'_, Arc<AppState>>,
    name: String,
    arguments: String
) -> Result<serde_json::Value, String> {
    let engine = state.engine.lock().await;
    engine.execute_tool(&name, &arguments).await
}

fn main() {
    let state = Arc::new(AppState {
        engine: Mutex::new(Engine::new()),
    });

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_clipboard::init())
        .plugin(tauri_plugin_process::init())
        .manage(state)
        .invoke_handler(tauri::generate_handler![chat, execute_tool])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                if let Some(window) = app.get_webview_window("main") {
                    window.open_devtools();
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
