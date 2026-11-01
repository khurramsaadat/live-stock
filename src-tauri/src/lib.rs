#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      // Initialize Finnhub client with env vars — key never in JS bundle
      app.handle().plugin(
        tauri_plugin_shell::Builder::default().build(),
      )?;
      Ok(())
    })
    .run(tauri::generate_context!())
    .invoke_handler(tauri::generate_handler!([get_finnhub_api_key]))
    .run(tauri::generate_context!())
    .expect("error while building tauri application");
}

#[tauri::command]
fn get_finnhub_api_key() -> String {
  // Read from env; falls empty if not set (the JS mock feed will activate)
  std::env::var("MARKET_API_KEY").unwrap_or_default()
}
