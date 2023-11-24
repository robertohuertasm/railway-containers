FROM node:20 AS build-frontend
WORKDIR /app
COPY ./frontend ./
RUN npm install
RUN npm run build

FROM rust:1 AS build-rust
WORKDIR /server
COPY ./src ./src
COPY ./Cargo.lock .
COPY ./Cargo.toml .
RUN cargo build --release

FROM rust:1-slim
COPY --from=build-frontend /app/build ./build
COPY --from=build-rust /server/target/release/railway-containers /
EXPOSE 3000
CMD ["/railway-containers"]
