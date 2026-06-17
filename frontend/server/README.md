# Backend API

Zero-dependency Node.js backend for the enterprise learning platform.

## Run

```bash
npm run server
```

The API listens on `http://127.0.0.1:8080`.

Run the frontend and backend together:

```bash
npm run dev:full
```

Demo account:

```text
username: admin
password: 123456
```

## Storage

Runtime data is persisted to `server/data/database.json`. The file is created
from `server/data/seed.js` on the first startup and is ignored by Git.

Environment variables:

```text
API_HOST=127.0.0.1
API_PORT=8080
API_DATA_FILE=/absolute/path/database.json
API_TOKEN_SECRET=change-me
API_TOKEN_LIFETIME=28800
API_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## API Groups

- `POST /api/auth/login`
- `/api/{table}/list|detail|add|update|delete`
- `/api/views/**`
- `/api/procedures/**`
- `GET /api/health`

Except for login and health, requests require:

```text
Authorization: Bearer <token>
```

