# Railway Containers

Small project to spin up and spin down a container using the Railway GQL API.

You'll need a token to sign in.

## Setup

Install [cargo-make](https://github.com/sagiegurari/cargo-make):
  
```bash
cargo install cargo-make
```

And then bootstrap the frontend:
  
```bash
makers web-bootstrap
```

Now you can run the api:

```bash
makers api-run
# or in watch mode
makers api-watch
```

The api will be available at `http://localhost:3000`. It will proxy the `Railway GraphQL API` and also serve the frontend.

In case you want to run the frontend separately in watch mode, then run:

```bash
makers web-serve
```

## Demo

![Demo](frontend/demo.png)

https://github.com/robertohuertasm/railway-containers/assets/696981/2863a16d-7ee7-44ef-b1d2-9d7dbdd6613b
