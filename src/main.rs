mod handlers;
#[path = "tracing.rs"]
mod tracing_setup;

use actix_web::{middleware::Logger, App, HttpServer};
use actix_web_lab::web::spa;
use tracing_setup::setup_tracing;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // env vars if present
    dotenvy::from_filename(".env").ok();

    // set up tracing
    setup_tracing();
    tracing::info!("Starting up the server");

    // set up server
    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let address = format!("0.0.0.0:{}", port);

    // spa
    let spa_dir = std::env::var("SPA_DIR").unwrap_or_else(|_| "./frontend/build".to_string());
    let index_file = format!("{}/index.html", spa_dir);

    HttpServer::new(move || {
        // app
        App::new()
            .wrap(Logger::default())
            .configure(handlers::configuration)
            .service(
                spa()
                    .index_file(index_file.clone())
                    .static_resources_location(spa_dir.clone())
                    .finish(),
            )
    })
    .bind(&address)
    .unwrap_or_else(|_| panic!("Can not bind to address {}", address))
    .run()
    .await
}
