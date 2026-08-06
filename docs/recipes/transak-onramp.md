# Transak On-Ramp Backend API

This document describes the backend required by vechain-kit's fiat on-ramp feature (`PayWithTransakButton`, `TransakCheckoutModal`).

## Why a backend is required

Transak deprecated direct widget URLs (API key in the query string). Widgets now only load from a **Secure Widget URL** minted by Transak's Create Widget URL API, which is authenticated with your **API secret**. That secret must never be exposed in the browser, so a small server endpoint is required.

The flow is:

```text
Browser (vechain-kit)          Your backend                 Transak
┌──────────────────┐   POST   ┌──────────────────┐   POST  ┌──────────────────┐
│ widgetUrlBuilder │ ───────► │ /api/transak/    │ ──────► │ /api/v2/         │
│ (kit passes      │          │ widget-url       │ ①token  │ auth/session     │
│ walletAddress,   │          │                  │        │                  │
│ fiat, env...)    │          │ ② POST widget    │ ◄────── │ returns         │
│                  │          │  (server-to-     │  widget │ secure widget    │
│                  │ ◄─────── │   server)        │   URL   │ URL (5 min TTL)  │
└──────────────────┘  widget  └──────────────────┘         └──────────────────┘
     URL returned                 ▲
     └─► Transak SDK loads        │ ① access token via POST /partners/api/v2/refresh-token
                                  │    (7-day validity, cache it)
```

## 1. Create Transak API credentials

1. Go to the [Transak Partner Dashboard](https://dashboard.transak.com) and create a partner account.
2. Generate an **API key** and **API secret**. Credentials are environment-specific:
   - **Sandbox** credentials (for testing) — work against the `staging` endpoints.
   - **Production** credentials — work against the `production` endpoints.
3. Add the `referrerDomain` of your app (the domain the widget will be served from) as an allowed referrer, otherwise session creation fails with `403`.
4. Transak requires the end user's real IP on its authenticated APIs (`x-user-ip` header) — your server must forward the caller's IP.

## 2. Server and client environment variables

| Variable | Scope | Description |
| --- | --- | --- |
| `TRANSAK_API_KEY` | Server only | Partner API key. Never in the browser bundle. |
| `TRANSAK_API_SECRET` | Server only | Partner API secret. Keep it on the backend only. |
| `NEXT_PUBLIC_TRANSAK_API_KEY` | Client | Same API key, safe to expose (works only with the server-side secret). |
| `NEXT_PUBLIC_TRANSAK_API_URL` | Client | Base URL of your mini-server (leave empty for same-origin). |
| `NEXT_PUBLIC_TRANSAK_ENVIRONMENT` | Client | `'staging'` or `'production'`. Overrides the kit's auto-derived value. Set to `'staging'` for preview deployments and `'production'` for live. |

## 3. Endpoint contract

### `POST /api/transak/widget-url`

**Request:**
```json
{
  "environment": "staging",
  "widgetParams": {
    "apiKey": "your_transak_api_key",
    "referrerDomain": "https://yourapp.com",
    "walletAddress": "0x...",
    "fiatAmount": "10",
    "fiatCurrency": "USD",
    "cryptoCurrencyCode": "VET",
    "network": "vechain",
    "defaultCryptoCurrency": "VET",
    "disableWalletAddressForm": true
  }
}
```

| Field | Description |
| --- | --- |
| `environment` | Which Transak environment to use. vechain-kit derives it automatically from the connected VeChain network (`main` → `production`, `test`/`solo` → `staging`) unless overridden via `TransakConfig.environment` on `VeChainKitProvider`. Your endpoint should trust this value and select the matching Transak base URLs. |
| `widgetParams` | Transak widget configuration, see the [Transak query parameters docs](https://docs.transak.com/customization/query-parameters). |

**Server behavior:**

1. Obtain a partner access token via `POST https://api-stg.transak.com/partners/api/v2/refresh-token` (staging) or `POST https://api.transak.com/partners/api/v2/refresh-token` (production), with headers `x-api-key` and `api-secret` and body `{ "apiKey": ... }`. The token is valid for **7 days** — cache it and reuse it. Cache per environment; a staging token must never be sent to production endpoints.
2. Mint the widget session via `POST https://api-gateway-stg.transak.com/api/v2/auth/session` (staging) or `POST https://api-gateway.transak.com/api/v2/auth/session` (production), with headers `x-api-key`, `access-token` and `x-user-ip` (the caller's real IP, e.g. from `x-forwarded-for`), and body `{ "widgetParams": ... }`.
3. Return Transak's response.

**Response (200):**
```json
{
  "data": {
    "widgetUrl": "https://global-stg.transak.com/...?sessionId=..."
  }
}
```

The widget URL is valid for **5 minutes** and single-use — mint a fresh one per checkout.

## 4. Wire it into vechain-kit

```tsx
<VeChainKitProvider
    transak={{
        apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY,
        widgetUrlBuilder: async ({
            walletAddress,
            fiatAmount,
            fiatCurrency,
            cryptoCurrency,
            network,
        }) => {
            const res = await fetch('/api/transak/widget-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    environment: process.env.NEXT_PUBLIC_TRANSAK_ENVIRONMENT as
                        | 'staging'
                        | 'production'
                        | undefined,
                    widgetParams: {
                        apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY,
                        referrerDomain: window.location.origin,
                        walletAddress,
                        fiatAmount,
                        fiatCurrency,
                        cryptoCurrencyCode: cryptoCurrency,
                        network,
                        defaultCryptoCurrency: 'VET',
                        disableWalletAddressForm: true,
                    },
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error ?? 'Failed to create Transak widget URL');
            return json.data.widgetUrl;
        },
    }}
>
```

The `environment` parameter is passed through to your `widgetUrlBuilder` — your backend uses it to select the correct Transak endpoints. Set `transak.environment` explicitly (e.g. `NEXT_PUBLIC_TRANSAK_ENVIRONMENT='staging'` for previews, `'production'` for live) when you want to force the value regardless of the connected VeChain network. Omit it to let the kit auto-derive (`main` → `production`, `test`/`solo` → `staging`).

## 5. Reference implementation

A complete, working Next.js implementation ships in the repo:

- Route: `examples/next-template/src/app/api/transak/widget-url/route.ts`
- Provider wiring: `examples/next-template/src/app/providers/VechainKitProviderWrapper.tsx`
- Env vars: `examples/next-template/.env.example`

## 6. Mandatory Transak integration requirements

These are **architectural prerequisites** for any production deployment of the on-ramp feature, regardless of the backend framework you choose. Transak enforces them server-side; missing any of them results in `403` / `401` errors from the Transak API.

### 6.1 Credential isolation

| Property | Value | Where |
| --- | --- | --- |
| `TRANSAK_API_KEY` | Partner API key | Server env only — never in the browser bundle |
| `TRANSAK_API_SECRET` | Partner API secret | Server env only — never sent to the client under any circumstance |
| `NEXT_PUBLIC_TRANSAK_API_KEY` | Same API key, safe to expose | Client bundle (used by the kit to pass through to your backend) |

The **API key** is safe to ship in the client bundle — it only works together with the **API secret**, which must stay server-side. The kit never needs the secret.

### 6.2 `x-api-key` header (server-to-Transak only)

Transak requires `x-api-key` on every authenticated API call (`refresh-token` and `auth/session`). Set it from `TRANSAK_API_KEY` **on the backend**, never from a client-supplied value. The `apiKey` in `widgetParams` is the partner-config value for the widget session, not the authentication key — do not conflate them.

### 6.3 `x-user-ip` header (forward the real caller IP)

Transak needs the end user's real IP for fraud detection and geo-compliance. Your backend **must** forward it as `x-user-ip` on the `auth/session` call. Use the leftmost public IP from:

```
x-forwarded-for: 203.0.113.42, 10.0.0.1
```

Do not send your server's own IP — Transak will reject shared/NAT IPs in production. If you run behind a CDN or proxy, ensure the chain preserves the original client IP (e.g. CloudFront → `X-Forwarded-For`, ALB → `X-Forwarded-For`).

### 6.4 Backend IP whitelisting

Transak's production API can be locked to a set of **whitelisted source IPs** (configured in the Partner Dashboard under *API Settings → IP Whitelisting*). Your backend must have a **fixed egress IP** (or a small known range). This is mandatory for production — staging does not enforce it.

Checklist:

- [ ] Deploy the backend on infrastructure with a static NAT / elastic IP (Lambda behind API Gateway, a fixed-IP container, or a VPS with a static IP)
- [ ] Add every backend egress IP to the Transak IP whitelist in the Partner Dashboard
- [ ] If you use a serverless platform with rotating IPs (e.g. Vercel functions without a NAT gateway), put a proxy with a fixed IP in front, or move the endpoint to infra that provides one

### 6.5 CORS — restrict to your domains only

Your `/api/transak/widget-url` endpoint must set CORS headers that allow **only your own origins**:

```http
Access-Control-Allow-Origin: https://yourapp.com
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type
```

Never use `Access-Control-Allow-Origin: *` — any website could then mint Transak sessions on your billing account. For multiple environments, maintain an explicit allow-list:

```js
const ALLOWED_ORIGINS = new Set([
    'https://yourapp.com',
    'https://preview.vechainkit.vechain.org',
]);
const origin = req.headers.get('origin');
if (ALLOWED_ORIGINS.has(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
}
```

The `referrerDomain` sent in `widgetParams` must also match one of the domains registered in your Transak Partner Dashboard (see step 3 in section 1 above). Transak checks it server-side; a mismatch yields `403`.

### 6.6 Rate limiting

Your endpoint is unauthenticated from the client's perspective — protect it with an in-memory or distributed rate limit so a single caller cannot mint unlimited Transak sessions against your credentials. The reference implementation in the repo uses a simple in-memory cap (20 requests/minute/IP). For horizontally-scaled backends, use a shared store (Redis, DynamoDB, etc.).

### 6.7 Partner onboarding checklist

Before going live, confirm every item in the Transak Partner Dashboard:

- [ ] Production API key + secret generated (not the sandbox ones)
- [ ] All frontend domains added to **Allowed Referrer Domains** (production + any preview subdomains)
- [ ] All backend egress IPs added to **IP Whitelisting** (production only)
- [ ] KYC/AML settings configured (required countries, default fiat currency, default crypto)
- [ ] Wallet address validation enabled (`disableWalletAddressForm: true` — the kit passes the connected wallet address directly; do not let users type an arbitrary address)
- [ ] Webhook URL configured (for order status callbacks — not handled by the kit, must be on your backend)
- [ ] Test purchase completed end-to-end on staging before switching to production credentials
