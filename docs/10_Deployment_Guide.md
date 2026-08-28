## 1. Quick Simple Deployment Architecture (Render + Vercel / Netlify)

For fast, free, and hassle-free deployment without managing VPS servers or Docker commands, AnveshakSutra uses:
- **Backend API & PostgreSQL & Workers:** Hosted on **[Render.com](https://render.com)** via `render.yaml` Blueprint.
- **Frontend SPA / PWA:** Hosted on **[Vercel](https://vercel.com)** or **[Netlify](https://netlify.com)** via automatic Git integration.

```
       USER BROWSER / PWA
                │
                ├─────────────────────────────► Vercel / Netlify (React SPA)
                │                               • https://anveshaksutra.vercel.app
                │                               • Auto SSL, Global CDN, Zero Config
                │
                └─────────────────────────────► Render.com (FastAPI Backend)
                                                • http://localhost:8000
                                                • Managed PostgreSQL + Redis + Workers
```

---

## 2. Step-by-Step 1-Click Deployment

### 🅰️ Deploy Backend on Render (5 Minutes)
1. Go to **[dashboard.render.com](https://dashboard.render.com)** and click **"New +" → "Blueprint"**.
2. Connect your GitHub repository: `GuruMachanica/AnveshakSutra`.
3. Render automatically reads [`render.yaml`](file:///c:/Desktop/Stand-Up/Projects/AnveshakSutra/render.yaml) and provisions:
   - **FastAPI Web Service** (`anveshaksutra-backend`)
   - **Celery Worker Service** (`anveshaksutra-worker`)
   - **Managed PostgreSQL Database** (`anveshaksutra-db`)
4. Click **"Apply"**. Once deployed, copy your backend URL (e.g., `http://localhost:8000`).

---

### 🅱️ Deploy Frontend on Vercel (2 Minutes)
1. Go to **[vercel.com](https://vercel.com)** and click **"Add New" → "Project"**.
2. Select your repository `GuruMachanica/AnveshakSutra`.
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `VITE_API_URL` = `http://localhost:8000/api/v1`
5. Click **"Deploy"**. Vercel will build and deploy your React + Three.js + Anime.js web app!

---

### 🅲 Alternative: Deploy Frontend on Netlify (2 Minutes)
1. Go to **[app.netlify.com](https://app.netlify.com)** and click **"Add new site" → "Import an existing project"**.
2. Select GitHub and choose `GuruMachanica/AnveshakSutra`.
3. Netlify automatically reads [`frontend/netlify.toml`](file:///c:/Desktop/Stand-Up/Projects/AnveshakSutra/frontend/netlify.toml).
4. In Environment variables, set `VITE_API_URL` to your Render backend URL.
5. Click **"Deploy site"**.

---

## 3. Environment Variables Specification (`.env.production`)

```ini
# --- APPLICATION & SECURITY ---
ENVIRONMENT=production
PROJECT_NAME="AnveshakSutra"
VERSION="1.0.0"
API_V1_STR="/api/v1"
BACKEND_CORS_ORIGINS=["https://anveshaksutra.io","https://www.anveshaksutra.io"]

# Master JWT & Cryptographic Salts
JWT_SECRET_KEY="GENERATE_A_64_CHAR_HEX_SECRET_FOR_PRODUCTION"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# WebAuthn (Passkeys)
RP_ID="anveshaksutra.io"
RP_NAME="AnveshakSutra"
RP_ORIGIN="https://anveshaksutra.io"

# --- DATABASE (PostgreSQL) ---
POSTGRES_USER=anveshak_admin
POSTGRES_PASSWORD=STRONG_PRODUCTION_POSTGRES_PASSWORD
POSTGRES_DB=anveshaksutra_prod
DATABASE_URL=postgresql+asyncpg://anveshak_admin:STRONG_PRODUCTION_POSTGRES_PASSWORD@postgres:5432/anveshaksutra_prod

# --- CACHE & QUEUE (Redis) ---
REDIS_PASSWORD=STRONG_PRODUCTION_REDIS_PASSWORD
REDIS_URL=redis://:STRONG_PRODUCTION_REDIS_PASSWORD@redis:6379/0
CELERY_BROKER_URL=redis://:STRONG_PRODUCTION_REDIS_PASSWORD@redis:6379/0
CELERY_RESULT_BACKEND=redis://:STRONG_PRODUCTION_REDIS_PASSWORD@redis:6379/0

# --- DOMAIN & SSL ---
DOMAIN_NAME=anveshaksutra.io
SSL_EMAIL=admin@anveshaksutra.io
```

---

## 4. One-Click VPS Deployment Instructions

### Step 1: Clone Repository & Configure Environment
```bash
git clone https://github.com/GuruMachanica/AnveshakSutra.git /opt/anveshaksutra
cd /opt/anveshaksutra
cp .env.example .env.production
nano .env.production  # Set domain, secure passwords, and JWT secret
```

### Step 2: Launch Production Containers
```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

### Step 3: Run Database Migrations
```bash
docker compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

### Step 4: Verify Health & Running Services
```bash
docker compose -f docker-compose.prod.yml ps
curl -k https://localhost/health
```

---

## 5. Security & Hardening Checklist for Production

- [x] **No Root Containers:** Backend and Nginx containers run under unprivileged user IDs.
- [x] **Automatic Restart:** `restart: unless-stopped` on all services.
- [x] **Database Isolation:** PostgreSQL and Redis ports (5432, 6379) are bound to the internal Docker network, NOT exposed publicly.
- [x] **HTTPS & HSTS:** Strict TLS 1.3 enforcement with `Strict-Transport-Security` preload headers.
- [x] **Rate Limiting:** API endpoints throttled via Nginx (`10 req/sec` per IP) and Redis token buckets.
- [x] **Zero Plaintext Persistence:** Cryptographic verification that no decrypted secrets are logged.
