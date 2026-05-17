# Cowboy Burger

Frontend project built with `React` and `TypeScript`.

## Stack

- `React 18`
- `TypeScript`
- `Redux Toolkit`
- `React Router`
- `Webpack`
- `Jest`
- `Cypress`
- `Storybook`

## Run locally

Install dependencies:
 
```bash
npm install
```

Create `.env` from `.env.example`:

```env
APP_API_URL=https://api.example.com/api
APP_WS_URL=wss://api.example.com
```

`APP_API_URL` is used for HTTP requests. `APP_WS_URL` is used for realtime order streams. If `APP_WS_URL` is omitted, the app derives it from `APP_API_URL`.

Start the app:

```bash
npm start
```

Start the local API server:

```bash
npm run server
```

Production build:

```bash
npm run build
```

## Deploy

The project is configured for deployment to `GitHub Pages` through `GitHub Actions`.

Before deploying, set repository variables:

- `APP_API_URL`
- `APP_WS_URL`

## Local backend

The repository includes a local backend in `server/` with:

- ingredient catalog
- authentication
- order creation
- order details
- realtime order feeds over WebSocket

Demo account:

```text
email: demo@cowboy.local
password: 123456
```
