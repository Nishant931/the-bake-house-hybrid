# Cloudflare Deployment Guide for The Bake House

This project uses **Cloudflare Pages** to host the Backend API logic and **Cloudflare D1** for the database.

## 1. Create Cloudflare Pages Project
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **"Workers & Pages"** -> **"Create application"** -> **"Pages"** -> **"Connect to Git"**.
3. Select the repository: `Nishant931/the-bake-house-hybrid`.
4. **Build Settings:**
   - **Framework preset:** `None` (Since we only need Pages to host the `/functions` directory for the API).
   - **Build command:** `exit 0` (We don't need a build step for the backend functions).
   - **Build output directory:** `public` (Just to satisfy the requirement).

## 2. Configure Compatibility Flags
To support Prisma and Node.js APIs in Cloudflare:
1. Go to your Pages project **Settings** -> **Functions** -> **Compatibility flags**.
2. For both **Production** and **Preview**, add the following flag:
   - `nodejs_compat`

## 3. Bind D1 Database
1. Go to your Pages project **Settings** -> **Functions** -> **D1 database bindings**.
2. Click **"Add binding"**.
3. **Variable name:** `DB`
4. **D1 database:** Select `the-bake-house-db` (which I have already created and seeded for you).

## 4. Deployment
1. Go to the **"Deployments"** tab and click **"Create new deployment"**.
2. Once deployed, Cloudflare will provide a URL (e.g., `https://the-bake-house.pages.dev`).
3. **Important:** Copy this URL and add it to your **Vercel** environment variables as `NEXT_PUBLIC_API_URL` (appending `/api` at the end).

## 5. D1 Database Details (Already Initialized)
- **Database Name:** `the-bake-house-db`
- **Database ID:** `2277754c-b925-4e6d-b413-af01de4fa68c`
- **Tables:** `Category`, `Product`, `ProductVariant`, `Image`, `Tag` (All seeded with ~60 products).

---

## Why this works?
By placing the API logic in Cloudflare Pages `/functions`, we bypass Vercel's serverless limitations and connect directly to the D1 database over Cloudflare's internal network, ensuring the lowest possible latency for your data.
