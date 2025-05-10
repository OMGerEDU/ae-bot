# AliExpress Affiliate Telegram Bot (Vercel Ready)

Minimal Next.js (API‑only) project written in TypeScript that:

* Exposes **POST `/api/link`** – returns an AliExpress affiliate URL for any product link.
* Includes an optional **Telegram bot** (`/bots/affiliateBot.ts`) you can run with `npm run bot`.

## Quick start

1. **Install**

```bash
npm install
```

2. **Create `.env.local`** (copy from `.env.example`) and fill:

```
AE_APP_KEY=
AE_APP_SECRET=
AE_PID=
TELEGRAM_BOT_TOKEN=
NEXT_PUBLIC_HOST_NAME=https://your-vercel-domain
```

3. **Dev**

```bash
npm run dev        # API at http://localhost:3000/api/link
npm run bot        # Telegram polling bot
```

4. **Deploy to Vercel**

```bash
vercel --prod
```

Add the same environment variables in the Vercel dashboard.

## Usage

*Send to Telegram*:

```
/link https://www.aliexpress.com/item/123456.html
```

Bot replies with your PID-tagged affiliate URL.

*Call the API directly*:

```bash
curl -X POST https://your-vercel-domain/api/link \
     -H 'Content-Type: application/json' \
     -d '{"url":"https://www.aliexpress.com/item/123456.html"}'
```

---

### Notes

* No database required – each request is individually signed with `AppSecret`.
* Works on the free Vercel tier; build output is ≈5 MB.
