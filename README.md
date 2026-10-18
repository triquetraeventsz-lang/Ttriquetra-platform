# Triquetra Platform

A monorepo with three apps sharing one MongoDB-backed API:

- **`client/`** — the public corporate site (React + Vite + Tailwind).
- **`admin/`** — the admin panel used to manage site content and event campaigns (React + Vite + Tailwind).
- **`server/`** — the Express + Mongoose API both of the above talk to. Nothing else connects to MongoDB directly.

`triquetra-concert-teaser/` (the live concert landing page) is a separate project with its own repo and deployment — it is not part of this monorepo and nothing here touches it.

## Prerequisites

- Node.js 20+ and npm.
- A MongoDB Atlas account (free tier is enough) — see [Setting up MongoDB Atlas](#setting-up-mongodb-atlas) below.
- Optional, only if you need to upload media: a Cloudflare R2 bucket — see [Setting up Cloudflare R2](#setting-up-cloudflare-r2-optional) below.

## Setup

```bash
npm install
```

This installs dependencies for all three workspaces (`client`, `admin`, `server`) in one pass.

Then create a real `.env` for the server from its example:

```bash
cp server/.env.example server/.env
```

and fill in `MONGODB_URI` and `JWT_SECRET` (see below). `client/` and `admin/` also each have a `.env.example` — copy those too if you need to change their defaults (both already work out of the box against a server running on `localhost:5000`).

Once `server/.env` has a real `MONGODB_URI`, create the first admin user (there's no other way in — every admin API route requires already being signed in as an admin):

```bash
npm run create-admin -- "Your Name" you@example.com "a-strong-password"
```

Optionally seed the CMS with placeholder Pages/Navigation/SiteSettings matching the real site structure:

```bash
npm run seed
```

## Running it

```bash
npm run dev
```

Starts all three apps together:

| App | URL |
|---|---|
| `client` (public site) | http://localhost:5173 |
| `admin` (admin panel) | http://localhost:5174 |
| `server` (API) | http://localhost:5000 |

To build the public site and admin panel for deployment:

```bash
npm run build
```

(`server` doesn't need a build step — it runs directly with `npm run start -w server`.)

Run the server's end-to-end test suite (spins up a real, temporary in-memory MongoDB — no Atlas connection needed):

```bash
npm run test -w server
```

## Environment variables

### `server/.env`

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | Yes | Your Atlas connection string (or any MongoDB instance). Server exits immediately with a clear error if this is wrong or unreachable. |
| `JWT_SECRET` | Yes | Any long random string. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. |
| `PORT` | No | Defaults to `5000`. |
| `CLIENT_URL` / `ADMIN_URL` | No | Defaults to the local dev ports. In production, set these to your real deployed origins — CORS only allows credentialed requests from exactly these two. |
| `NODE_ENV` | **Yes, in production** | Defaults to `development`, which is fine locally. In production this must be exactly `production` — the admin auth cookie only gets its `Secure` flag when `NODE_ENV=production` (see `utils/jwt.js`); get this wrong and the session cookie travels over plain HTTP. |
| `TRUST_PROXY_HOPS` | **Yes, in production** | Defaults to `0` (trust no proxy — correct for local dev, where there isn't one). Once deployed behind a real reverse-proxy host (Render/Railway/Fly), set this to `1`, or the IP-based rate limiters on login and the public lead form will throw on every request instead of working. If you ever add Cloudflare in front of that host too, it needs to be `2` instead. Never set this to `1`+ without a real proxy in front — doing so lets any client spoof `X-Forwarded-For` to dodge rate limiting entirely. |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` / `R2_PUBLIC_URL` | No | Only needed for the admin Media library's upload feature. Without them, uploads fail with a clear "not configured" error instead of a crash — everything else works fine. |

**Keep all of the above in `server/.env` (or your host's secrets manager) only — never in `admin/` or `client/`, and never under a filename other than `.env`/`.env.*`.** Both dev servers correctly block requests for `.env`-pattern files; a differently-named file holding real credentials is not protected by that and will be served as a plain static file to anyone who requests it by name.

### `client/.env` and `admin/.env`

| Variable | Required | Notes |
|---|---|---|
| `VITE_API_URL` | No | Defaults to `http://localhost:5000`. Set to your deployed API URL in production. |
| `VITE_WEB3FORMS_ACCESS_KEY` (client only) | For the Contact page | Free key from [web3forms.com](https://web3forms.com). Without it, the Contact form fails clearly rather than silently. |

## Setting up MongoDB Atlas

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a new free (M0) cluster.
2. Under **Database Access**, create a database user with a strong, generated password.
3. Under **Network Access**, add your current IP (or `0.0.0.0/0` for initial development — tighten this before going to production).
4. Click **Connect → Drivers**, copy the connection string, and replace `<password>` with your database user's password. Add a database name at the end if it isn't already there, e.g. `.../triquetra?retryWrites=true...`.
5. Paste that into `MONGODB_URI` in `server/.env`.

## Setting up Cloudflare R2 (optional)

Only needed if you want the admin Media library to actually upload files.

1. In the Cloudflare dashboard, go to **R2** and create a bucket.
2. Create an **R2 API token** with read/write access to that bucket — this gives you the Account ID, Access Key ID and Secret Access Key.
3. Enable public access on the bucket (or set up a custom domain for it) to get a public base URL.
4. Fill in the five `R2_*` variables in `server/.env`.

## Deployment

Not yet deployed anywhere — when you're ready:

- `client/` and `admin/` are static builds, deployable to **Cloudflare Pages** as two separate projects (put `admin` on its own subdomain, e.g. `admin.yourdomain.com`, so its auth cookie has a clean origin to scope to).
- `server/` needs a real Node host (Cloudflare Pages is static-only) — Render, Railway or Fly.io all work with a simple git-push deploy.
- Point `CLIENT_URL`/`ADMIN_URL` (server) and `VITE_API_URL` (client/admin) at the real deployed origins once they exist.
- `triquetra-concert-teaser/` is unaffected by any of this — it keeps its own separate repo and deployment.
