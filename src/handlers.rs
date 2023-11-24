use actix_cors::Cors;
use actix_web::{
    http::header::Header,
    web::{self, Json, ServiceConfig},
    HttpRequest, HttpResponse,
};
use actix_web_httpauth::headers::authorization::{Authorization, Bearer};
use serde_json::Value;
use tracing::instrument;

const RAILWAY_API: &str = "https://backboard.railway.app/graphql/v2";

pub fn configuration(cfg: &mut ServiceConfig) {
    // cors
    let enable_cors = std::env::var("ENABLE_CORS").map_or(false, |x| x != "0");
    let cors = if enable_cors {
        Cors::default().allowed_methods(vec!["GET", "POST"])
    } else {
        Cors::permissive()
    };

    // mind the order of the routes!
    cfg.service(
        web::scope("/api")
            .wrap(cors)
            .route("/railway", web::get().to(railway))
            .route("/railway", web::post().to(railway))
            .route("/health", web::get().to(health))
            .route("/version", web::get().to(version)),
    );
}

#[instrument(level = "debug", skip(payload, request))]
async fn railway(payload: Json<Value>, request: HttpRequest) -> actix_web::Result<HttpResponse> {
    let auth = Authorization::<Bearer>::parse(&request)?;
    let client = reqwest::Client::new();

    let response = client
        .post(RAILWAY_API)
        .header("Content-Type", "application/json")
        .bearer_auth(auth.as_ref().token())
        .body(payload.to_string())
        .send()
        .await;

    match response {
        Ok(response) => {
            let body: String = response.text().await.unwrap();
            tracing::trace!("Response: {}", body);
            Ok(actix_web::HttpResponse::Ok().body(body))
        }
        Err(e) => {
            tracing::error!("Error: {}", e);
            Ok(actix_web::HttpResponse::InternalServerError().finish())
        }
    }
}

#[instrument(level = "debug")]
async fn health() -> actix_web::Result<HttpResponse> {
    Ok(actix_web::HttpResponse::Ok().finish())
}

#[instrument(level = "debug")]
async fn version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}
