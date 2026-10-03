# SkillSnap AI – Smart Skill Analyzer & Career Roadmap System (MERN + AI)

## Prerequisites
Node.js 18+, MongoDB running locally (port 27017) or a MongoDB Atlas URI, and an AI API key (default provider: Google Gemini – free key at https://aistudio.google.com/apikey).

## 1. Backend (port 5000)
```
cd backend
npm install
cp .env.example .env      # then edit .env: set AI_API_KEY (and MONGO_URI if using Atlas)
npm run dev
```
## 2. Frontend (port 5173)
```
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173

## REST API
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/analyze | Generate AI analysis and save it |
| GET | /api/analysis | List saved analyses (summary fields) |
| GET | /api/analysis/:id | Get one full analysis |
| DELETE | /api/analysis/:id | Delete one analysis |

## Changing the AI provider
Only `backend/services/aiService.js` (function `callAI`) talks to the provider. Replace it to use another LLM.
## Deploy
Frontend `npm run build` -> Vercel/Netlify (set VITE_API_URL). Backend -> Render (set env vars, FRONTEND_ORIGIN). DB -> MongoDB Atlas.
