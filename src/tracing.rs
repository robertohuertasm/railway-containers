use tracing::Subscriber;
use tracing_subscriber::{
    fmt::{self},
    prelude::*,
    registry::LookupSpan,
    EnvFilter, Layer,
};

fn format_layer<S>() -> Box<dyn Layer<S> + Send + Sync>
where
    S: Subscriber,
    for<'a> S: LookupSpan<'a>,
{
    if std::env::var("NDJSON").map_or(false, |x| x != "0") {
        fmt::layer()
            .with_ansi(true)
            .with_timer(tracing_subscriber::fmt::time::UtcTime::rfc_3339())
            .json()
            .flatten_event(true)
            .with_target(true)
            .with_span_list(true)
            .boxed()
    } else {
        fmt::layer()
            .with_ansi(true)
            .with_timer(tracing_subscriber::fmt::time::UtcTime::rfc_3339())
            .boxed()
    }
}

fn filter_layer() -> EnvFilter {
    EnvFilter::from_default_env()
}

pub fn setup_tracing() {
    let subscriber = tracing_subscriber::registry()
        .with(filter_layer())
        .with(format_layer());
    subscriber.init();
}
