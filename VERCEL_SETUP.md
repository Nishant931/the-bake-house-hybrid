# Vercel Deployment Guide for The Bake House

This project uses a hybrid architecture: **Vercel** for the Frontend (UI) and **Cloudflare** for the Backend (API & D1 Database).

## 1. Import Project to Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Import the repository: `Nishant931/the-bake-house-hybrid`.

## 2. Configure Environment Variables
In the Vercel project settings, add the following environment variable:

| Key | Value | Description |
|-----|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://the-bake-house.pages.dev/api` | Your Cloudflare Pages URL |

> **Note:** Replace the value with your actual Cloudflare Pages URL once deployed.

## 3. Build Settings
- **Framework Preset:** Next.js
- **Root Directory:** `./`
- **Build Command:** `next build`
- **Output Directory:** `.next`

## 4. Why Hybrid?
- **Vercel:** Provides the best performance and developer experience for Next.js frontend features like Image Optimization and Middleware.
- **Cloudflare D1:** Offers a globally distributed SQLite database that is extremely cost-effective and integrates perfectly with Cloudflare Workers/Pages for the backend logic.

---

## Cloudflare Side (Quick Recap)
When setting up Cloudflare Pages:
1. Connect the same GitHub repo.
2. In **Settings > Functions > Compatibility Flags**, add `nodejs_compat`.
3. In **Settings > Functions > D1 Database Bindings**, add a binding:
   - **Variable name:** `DB`
   - **D1 Database:** `the-bake-house-db`
