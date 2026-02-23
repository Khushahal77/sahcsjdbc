# HCL Hackathon - Angular Frontend

Angular 19 standalone frontend with auth, routing, guards, and HTTP interceptor.

## Setup

```bash
cd frontend
npm install
```

## Run

```bash
npm start
```

App runs at `http://localhost:4200`

## Build

```bash
npm run build
```

## API Configuration

Update `src/environments/environment.ts` if your API runs on a different URL. Default: `https://localhost:5001/api`

Ensure your .NET API has CORS enabled and is running before testing login/signup.
