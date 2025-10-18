# shorten-url-for-logging

A simple URL shortener service built with Express.js and TypeScript. This service allows you to create shortened URLs and track redirect counts.

## Features

- Create shortened URLs with auto-generated keys
- Retrieve all shortened URLs or specific ones by key
- Automatic redirect tracking
- In-memory database storage
- Request/response logging with Winston
- Health check endpoints

## Installation

```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on the configured port (default: check your environment configuration).

## API Documentation

This project includes interactive API documentation using Swagger/OpenAPI:

- **Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs) - Interactive API documentation with a web interface where you can test all endpoints
- **OpenAPI JSON Spec**: [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json) - Raw OpenAPI 3.0 specification in JSON format

The Swagger UI provides a user-friendly interface to explore and test all API endpoints directly from your browser.

## How to Use

### API Endpoints

#### 1. Create a Shortened URL

**POST** `/api/shorten`

Create a new shortened URL.

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very/long/url/path"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com/very/long/url/path"}'
```

**Response (201):**
```json
{
  "originalUrl": "https://example.com/very/long/url/path",
  "shortenUrl": "http://localhost:3000/abc123",
  "shortenUrlKey": "abc123",
  "redirectCount": 0
}
```

---

#### 2. Get All Shortened URLs

**GET** `/api/shorten`

Retrieve all shortened URLs in the system.

**Example using curl:**
```bash
curl http://localhost:3000/api/shorten
```

**Response (200):**
```json
[
  {
    "originalUrl": "https://example.com/url1",
    "shortenUrl": "http://localhost:3000/xyz789",
    "shortenUrlKey": "xyz789",
    "redirectCount": 5
  },
  {
    "originalUrl": "https://example.com/url2",
    "shortenUrl": "http://localhost:3000/def456",
    "shortenUrlKey": "def456",
    "redirectCount": 2
  }
]
```

---

#### 3. Get Shortened URL by Key

**GET** `/api/shorten/:key`

Get details of a specific shortened URL.

**Example using curl:**
```bash
curl http://localhost:3000/api/shorten/abc123
```

**Response (200):**
```json
{
  "originalUrl": "https://example.com/very/long/url/path",
  "shortenUrl": "http://localhost:3000/abc123",
  "shortenUrlKey": "abc123",
  "redirectCount": 3
}
```

**Error Response (404):**
```json
{
  "error": "Shortened URL not found"
}
```

---

#### 4. Redirect to Original URL

**GET** `/:key`

Redirects to the original URL and increments the redirect count.

**Example using browser or curl:**
```bash
# Browser: Navigate to
http://localhost:3000/abc123

# Or using curl with follow redirects
curl -L http://localhost:3000/abc123
```

**Behavior:**
- Returns HTTP 302 redirect to the original URL
- Automatically increments the `redirectCount` for analytics

---

### Health Check Endpoints

#### Service Status

**GET** `/`

Check if the service is running.

```bash
curl http://localhost:3000/
```

**Response (200):**
```json
{
  "message": "URL Shortener Service is running!",
  "timestamp": "2025-10-18T12:00:00.000Z",
  "environment": "development"
}
```

#### Health Check

**GET** `/health`

Simple health check endpoint.

```bash
curl http://localhost:3000/health
```

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2025-10-18T12:00:00.000Z"
}
```

---

## Usage Example Flow

1. **Create a shortened URL:**
   ```bash
   curl -X POST http://localhost:3000/api/shorten \
     -H "Content-Type: application/json" \
     -d '{"originalUrl": "https://github.com/anthropics/claude-code"}'
   ```

   Response: `{"shortenUrlKey": "x8k2Lp", ...}`

2. **Visit the shortened URL:**
   ```bash
   curl -L http://localhost:3000/x8k2Lp
   # Redirects to https://github.com/anthropics/claude-code
   ```

3. **Check the statistics:**
   ```bash
   curl http://localhost:3000/api/shorten/x8k2Lp
   # Shows updated redirectCount
   ```

---

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created successfully
- `302` - Redirect
- `400` - Bad request (invalid URL format or missing parameters)
- `404` - Resource not found
- `500` - Internal server error

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Language:** TypeScript
- **Logging:** Winston
- **Database:** In-memory storage

## Project Structure

```
src/
├── core/
│   ├── errors/           # Error classes
│   ├── infrastructure/   # Database, config, logging
│   └── middlewares/      # Express middlewares
├── domains/
│   └── url-shortener/    # URL shortener domain logic
│       ├── handlers/     # Request handlers
│       ├── services/     # Business logic
│       ├── repositories/ # Data access
│       └── types/        # TypeScript types
├── routes/               # Route definitions
├── app.ts                # Express app setup
└── server.ts             # Server entry point
```
