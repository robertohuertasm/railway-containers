# ---- Base Node ----
FROM node:20 AS build
WORKDIR /app
COPY ./ ./
RUN npm install
RUN npm run build

# --- Release with Alpine ----
FROM node:20-alpine AS release
WORKDIR /app
COPY --from=build /app/build ./build
RUN npm install -g serve
EXPOSE 8080
CMD ["serve", "-s", "build", "-l", "8080"]
