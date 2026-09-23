# Build with AI — Backend

Node.js + Express + MongoDB backend for the Build with AI hackathon MVP.

## What is implemented

- Existing session-based registration/login/logout preserved
- `GET /api/auth/me`
- Multilingual citizen text reports
- Voice reports: audio → Gemini transcription → multilingual analysis → MongoDB
- Original text/transcription preserved
- English canonical text stored for downstream processing
- Category, subcategory, summary, urgency and keywords
- Report filtering and pagination
- Dashboard aggregation APIs
- Simple explainable intervention suggestions
- Audio upload validation and size limits
- MongoDB database name kept as `BuildWithAI`

## Setup

1. Copy `.env.example` to `.env`.
2. Set a valid `GEMINI_API_KEY`.
3. Make sure MongoDB is running.
4. Install dependencies:

```bash
npm install
```

5. Start:

```bash
npm run dev
```

The server defaults to `http://localhost:5000`.

## Authentication

Register:

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "password123"
}
```

Login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "password123"
}
```

Use a client that preserves cookies (`credentials: include` in the browser).

Check session:

```http
GET /api/auth/me
```

Logout:

```http
POST /api/auth/logout
```

## Reports

All report endpoints currently require an authenticated session.

### Text

```http
POST /api/reports/text
Content-Type: application/json

{
  "text": "আমাদের এলাকায় রাস্তা খুব খারাপ",
  "location": {
    "state": "West Bengal",
    "district": "Jhargram",
    "latitude": 22.45,
    "longitude": 86.98
  }
}
```

Pipeline:

`Original text → language detection → English translation → structured classification → MongoDB`

### Voice

```http
POST /api/reports/voice
Content-Type: multipart/form-data

audio=<audio file>
location={"state":"West Bengal","district":"Jhargram","latitude":22.45,"longitude":86.98}
```

Pipeline:

`Audio → Gemini transcription → language detection/translation/classification → MongoDB`

### Retrieve

```http
GET /api/reports
GET /api/reports/:id
```

Optional filters:

- `category`
- `language`
- `district`
- `urgency`
- `page`
- `limit`

## Dashboard APIs

```http
GET /api/dashboard/overview
GET /api/dashboard/categories
GET /api/dashboard/languages
GET /api/dashboard/urgency
GET /api/dashboard/hotspots
GET /api/dashboard/recommendations
```

These are calculated from MongoDB data; they are not hardcoded dashboard statistics.

## Important

Do not commit `.env`, API keys, or uploaded audio files to Git.
