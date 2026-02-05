# Pastebin-Lite

A production-grade Pastebin application built with clean architecture principles using Node.js, Express, TypeScript, and SQLite.

## 🚀 Features

- **Create Pastes**: Create text pastes with optional expiry time and view limits
- **Share Links**: Get shareable URLs for your pastes
- **TTL Support**: Set time-to-live for automatic expiry
- **View Limits**: Limit the number of times a paste can be viewed
- **Safe Rendering**: XSS protection with HTML escaping
- **TEST_MODE**: Deterministic time testing via `x-test-now-ms` header
- **Clean Architecture**: Strict layered structure following production best practices

## 📁 Project Structure

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

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Logging**: Winston
- **Validation**: express-validator

## 📦 Installation & Setup

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

## 🧪 API Endpoints

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

## 🧪 Testing with TEST_MODE

For deterministic time testing, set `TEST_MODE=1` in `.env` and use the `x-test-now-ms` header:

```bash
curl http://localhost:3000/api/pastes/:id \
  -H "x-test-now-ms: 1738742400000"
```

## 🏗️ Architecture Principles

### Clean Layered Structure

1. **Routes** → Define endpoints only
2. **Controllers** → Handle req/res, status codes
3. **Services** → Contain all business logic
4. **Database** → SQLite operations
5. **Utils** → Helper functions
6. **Middleware** → Cross-cutting concerns
7. **Config** → Environment and database setup

### Key Design Decisions

- **Separation of Concerns**: `server.ts` only starts the server, `app.ts` only configures Express
- **No Business Logic in Controllers**: Controllers only handle HTTP concerns
- **No Database Logic in Controllers**: All database operations in services
- **Centralized Error Handling**: Single error middleware for consistent responses
- **Type Safety**: Full TypeScript coverage with strict mode
- **Consistent Responses**: All API responses follow `{ success, message, data }` format
- **XSS Protection**: HTML escaping in view templates
- **Atomic Operations**: View counting uses SQLite's atomic UPDATE

## 🗄️ Persistence Layer

**Database**: SQLite with better-sqlite3

**Why SQLite?**
- ✅ Zero configuration - works immediately
- ✅ No authentication issues (file-based)
- ✅ Perfect for local development
- ✅ Fast synchronous API
- ✅ Single file storage (`data/pastebin.db`)
- ✅ Can easily switch to PostgreSQL for production

**Schema**:
```sql
CREATE TABLE pastes (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  max_views INTEGER,
  current_views INTEGER DEFAULT 0
);
```

**Indexes**:
- `expires_at` for efficient TTL queries
- Composite index on `(id, expires_at, max_views, current_views)` for constraint checking

## 🚀 Deployment

### For Production (PostgreSQL)

If you want to use PostgreSQL in production:

1. **Install pg library**:
   ```bash
   npm install pg @types/pg
   ```

2. **Update `src/config/database.ts`** to use PostgreSQL connection

3. **Set DATABASE_URL** in production environment

4. **Deploy to Vercel/Railway** with managed PostgreSQL

### Vercel Deployment

1. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

2. **Set environment variables** in Vercel dashboard:
   ```env
   DATABASE_URL=<your-postgres-url>  # If using PostgreSQL
   BASE_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

## 📝 Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## ✅ Testing

All endpoints have been tested and verified:
- ✅ Health check returns 200 OK
- ✅ Paste creation works with and without constraints
- ✅ Paste retrieval returns correct content
- ✅ TTL expiry logic functional
- ✅ View count limits working
- ✅ Combined constraints (TTL + views) working
- ✅ Error handling returns proper 4xx/5xx codes
- ✅ HTML view renders safely (XSS protected)

## 🧹 Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Clean Code**: Interview-quality, production-ready code

## 📄 License

MIT

## 👤 Author

Built with ❤️ following clean architecture principles