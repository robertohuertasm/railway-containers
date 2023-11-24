# ---- Base Node ----
FROM node:20 AS build-frontend
WORKDIR /app
COPY ./frontend ./
RUN cd npm install
RUN npm run build

FROM rust:stable AS build-rust
# Add our source code.
WORKDIR /server
COPY ./src .
COPY ./Cargo.lock .
COPY ./Cargo.toml .
# Build our application.
RUN cargo build --release

FROM debian:bullseye-slim
RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  ca-certificates \
  gcc \
  libc6-dev \
  ; \
  rm -rf /var/lib/apt/lists/*;
# getting what we need from the builder
COPY --from=build-frontend /app/build ./build
COPY --from=build-rust /server/target/release/railway-containers /
EXPOSE 3000
CMD ["/railway-containers"]
