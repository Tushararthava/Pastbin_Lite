# Pastebin-Lite

A production-grade Pastebin application built with clean architecture principles using Node.js, Express, TypeScript, and SQLite.

## Live Demo 🚀
**[https://pastbin-lite-one.vercel.app/](https://pastbin-lite-one.vercel.app/)**

## Features

- **Create Pastes**: Create text pastes with optional expiry time and view limits
- **Share Links**: Get shareable URLs for your pastes
- **TTL Support**: Set time-to-live for automatic expiry
- **View Limits**: Limit the number of times a paste can be viewed
- **Safe Rendering**: XSS protection with HTML escaping
- **TEST_MODE**: Deterministic time testing via `x-test-now-ms` header
- **Clean Architecture**: Strict layered structure following production best practices
## Project Structure

```
backend/
├── src/
│   ├── server.ts              # Server startup only
│   ├── app.ts                 # Express configuration only
│   ├── config/
│   │   ├── environment.ts     # Environment variables
│   │   └── database.ts        # SQLite connection
│   ├── routes/
│   ├── controllers/
│   ├── services/              # All business logic
│   ├── middleware/
│   ├── validators/
│   ├── utils/
│   ├── types/
│   └── views/
├── data/
│   └── pastebin.db           # SQLite database
├── public/
│   └── index.html            # Frontend UI
└── package.json
```
## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Logging**: Winston
- **Validation**: express-validator
## Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Pastbin_Lite/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   The `.env` file should contain:
   ```env
   PORT=3000
   NODE_ENV=development
   BASE_URL=http://localhost:3000
   TEST_MODE=0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000`
   The SQLite database will be created automatically at `backend/data/pastebin.db`
## API Endpoints

### Health Check
```http
GET /api/healthz
```

**Response:**
```json
{
  "success": true,
  "message": "OK",
  "data": { "ok": true }
}
```

### Create Paste
```http
POST /api/pastes
Content-Type: application/json

{
  "content": "Hello World",
  "ttl_seconds": 60,      // Optional
  "max_views": 5          // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Paste created successfully",
  "data": {
    "id": "K8e55A2FwyLJOmDY",
    "url": "http://localhost:3000/p/K8e55A2FwyLJOmDY"
  }
}
```

### Get Paste (API)
```http
GET /api/pastes/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Paste retrieved successfully",
  "data": {
    "content": "Hello World",
    "remaining_views": 4,
    "expires_at": "2026-02-05T10:00:00.000Z"
  }
}
```

### View Paste (HTML)
```http
GET /p/:id
```

Returns HTML page with the paste content.
## Testing with TEST_MODE

For deterministic time testing, set `TEST_MODE=1` in `.env` and use the `x-test-now-ms` header:

```bash
curl http://localhost:3000/api/pastes/:id \
  -H "x-test-now-ms: 1738742400000"
```


## Persistence Layer

**Database**: SQLite with better-sqlite3

This project uses SQLite for zero-configuration, reliable local persistence. The database is stored in `data/pastebin.db`.





