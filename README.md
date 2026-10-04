# BharatFix AI – Smart Infrastructure Problem Detection System

Citizens photograph a civic infrastructure problem (pothole, broken streetlight, garbage, waterlogging…), AI identifies it and suggests a severity, the location is captured, and the report lands on a dashboard where authorities prioritize and resolve it.

## Features

- **Report an issue** (`/report`) – 5-step flow: upload photo → AI analysis → confirm severity → location (GPS or manual) → review & submit. Returns a report ID like `BF-2026-123456`.
- **AI image analysis** – uses Google Gemini when `GEMINI_API_KEY` is set; otherwise returns a clearly labeled demo result so the app works offline.
- **Track a report** (`/track`) – look up any report ID to see its status timeline (Submitted → In Review → Resolved), photo, details and map location.
- **Dashboard** (`/dashboard`) – summary stats, severity breakdown, Leaflet/OpenStreetMap map of all reports, severity/status filters, and status updates (optionally protected by an admin key).

## Tech stack

| Layer    | Stack |
| -------- | ----- |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, React Router, React Leaflet |
| Backend  | Node.js, Express 5, TypeScript, Mongoose, Multer |
| Database | MongoDB Atlas |
| AI       | Google Gemini (`gemini-2.5-flash`) via REST |

## Project structure

```
bharatfix-ai/
├── backend/            Express + TypeScript API
│   ├── src/
│   │   ├── config/     env loading, MongoDB connection
│   │   ├── controllers/
│   │   ├── middleware/ uploads, admin guard, error handling
│   │   ├── models/     Report schema
│   │   ├── routes/
│   │   ├── services/   report + AI analysis logic
│   │   └── utils/
│   └── uploads/        uploaded images (git-ignored)
├── frontend/           React + Vite app
│   └── src/
│       ├── components/ layout, report flow, dashboard, ui
│       ├── pages/      Home, Report, Track, Dashboard
│       ├── services/   API client
│       └── utils/
└── render.yaml         Render blueprint for the backend
```

## Run locally

Requirements: Node.js 20+, a MongoDB Atlas cluster (with your IP added under **Network Access**).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGODB_URI
npm run dev            # http://localhost:5000
```

`backend/.env` variables:

| Variable         | Required | Description |
| ---------------- | -------- | ----------- |
| `PORT`           | no       | Defaults to `5000` |
| `MONGODB_URI`    | yes      | MongoDB Atlas connection string (one line) |
| `GEMINI_API_KEY` | no       | Enables real AI analysis ([get a key](https://aistudio.google.com/apikey)) |
| `GEMINI_MODEL`   | no       | Defaults to `gemini-2.5-flash` |
| `ADMIN_KEY`      | no       | When set, dashboard status updates require this key |
| `CLIENT_URL`     | no       | Comma-separated allowed frontend origins for CORS; empty allows all |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

Optionally create `frontend/.env` with `VITE_API_URL` if the API is not at `http://localhost:5000/api`.

## API

All responses use `{ success, message, data? }`.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/api/health` | Health check |
| POST   | `/api/analyze` | Multipart `image` → detected issue, category, confidence, severity |
| POST   | `/api/reports` | Multipart report (`image`, `issueType`, `category`, `confidence`, `isDemoAnalysis`, `severity`, `latitude`, `longitude`, `locationDescription`) |
| GET    | `/api/reports?severity=&status=` | List reports, newest first |
| GET    | `/api/reports/:reportId` | Get one report |
| PATCH  | `/api/reports/:reportId/status` | `{ "status": "Submitted" \| "In Review" \| "Resolved" }`; send `x-admin-key` header when `ADMIN_KEY` is set |
| GET    | `/api/dashboard/stats` | Totals by severity/status, open high-priority count, last 7 days |
| GET    | `/uploads/:file` | Uploaded images |

Images: JPG/PNG up to 10 MB.

## Deploy

**Backend (Render):** create a Blueprint from `render.yaml` (or a Web Service with root `backend`, build `npm install && npm run build`, start `npm start`). Set `MONGODB_URI`, `GEMINI_API_KEY`, `ADMIN_KEY`, and `CLIENT_URL` (your frontend URL). In MongoDB Atlas, allow access from `0.0.0.0/0` since Render IPs change.

> Render's free disk is ephemeral, so uploaded images are lost on redeploy. For production, move uploads to object storage (e.g. Cloudinary or S3).

**Frontend (Vercel):** import the repo with root directory `frontend` (Vite preset). Set `VITE_API_URL=https://<your-render-app>.onrender.com/api`. `vercel.json` handles client-side routing.

## Demo flow

1. Open `/report`, upload a photo of a road/civic issue, run the analysis, adjust severity, add location, submit.
2. Click **Track Report** on the success screen to see its status.
3. Open `/dashboard`, find the report on the map and in the list, and change its status to **In Review** / **Resolved**.
4. Re-open the tracking page to see the updated timeline.
