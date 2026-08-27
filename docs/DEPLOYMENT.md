# Production Deployment Guide: AnveshakSutra

This guide details the step-by-step instructions to deploy AnveshakSutra to **Supabase** (Database), **Render** (FastAPI Backend), and **Vercel** (React Frontend).

---

## 🗄️ Step 1: Database Setup (Supabase)

1. Create a free project at [**supabase.com**](https://supabase.com).
2. In your dashboard, open the **SQL Editor**.
3. Copy the entire contents of [**`backend/supabase_schema.sql`**](../backend/supabase_schema.sql) and paste it into the editor.
4. Click **Run**. This will create:
   - `users`, `identities`, `canary_tokens`, `incidents`, and `audit_logs` tables.
   - Fast $O(1)$ indexes on SHA-256 prefixes and tokens.
   - Row Level Security (RLS) policies.
5. In **Project Settings $\rightarrow$ API & Database**, copy:
   - **`DATABASE_URL`** (Connection String URI)
   - **`SUPABASE_URL`** (Project URL)
   - **`SUPABASE_KEY`** (`anon` public key)

---

## ⚙️ Step 2: Deploy Backend (Render)

1. Go to [**render.com**](https://render.com) and create a **Web Service**.
2. Connect repository: `https://github.com/GuruMachanica/AnveshakSutra.git`
3. Render uses the root [`Dockerfile`](../Dockerfile) or [`render.yaml`](../render.yaml) automatically:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check:** `/health`
4. Add the following **Environment Variables**:
   - `DATABASE_URL`: *(Your Supabase PostgreSQL URI)*
   - `SUPABASE_URL`: *(Your Supabase Project URL)*
   - `SUPABASE_KEY`: *(Your Supabase Anon Key)*
   - `JWT_SECRET_KEY`: `71f4b63ad4e9e8cf9deec1b90b2fff2437000b4c3f683e8581e61545235d12d0`
5. Click **Deploy**. Your API will be live at `https://anveshaksutra.onrender.com`.

---

## 🌐 Step 3: Deploy Frontend (Vercel)

1. Go to [**vercel.com**](https://vercel.com) and click **Add New... $\rightarrow$ Project**.
2. Select repository: `GuruMachanica/AnveshakSutra`.
3. Set **Root Directory** to `frontend`.
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://anveshaksutra.onrender.com/api/v1`
   - `VITE_SUPABASE_URL`: `https://<your-project>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your_anon_key`
5. Click **Deploy**. Your frontend will be live at `https://anveshak-sutra.vercel.app/`!
