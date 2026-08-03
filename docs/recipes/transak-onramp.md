# Transak On-Ramp Backend API

This document describes the backend required by vechain-kit's fiat on-ramp feature (`PayWithTransakButton`, `TransakCheckoutModal`).

## Why a backend is required

Transak deprecated direct widget URLs (API key in the query string). Widgets now only load from a **Secure Widget URL** minted by Transak's Create Widget URL API, which is authenticated with your **API secret**. That secret must never be exposed in the browser, so a small server endpoint is required.

The flow is:

```
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

## 2. Server environment variables

| Variable | Description |
| --- | --- |
| `TRANSAK_API_KEY` | Server-side API key (never expose the secret client-side). |
| `TRANSAK_API_SECRET` | Server-side API secret. Keep it on the backend only. |

## 3. Endpoint contract

### `POST /api/transak/widget-url`

**Request:**
```json
{
  "environment": "staging" | "production",
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
            environment,
        }) => {
            const res = await fetch('/api/transak/widget-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    environment,
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

The `environment` parameter arrives pre-derived from the connected VeChain network — no manual switching needed. Set `transak.environment` only to override (e.g. sandbox credentials on mainnet).

## 5. Reference implementation

A complete, working Next.js implementation ships in the repo:

- Route: `examples/next-template/src/app/api/transak/widget-url/route.ts`
- Provider wiring: `examples/next-template/src/app/providers/VechainKitProviderWrapper.tsx`
- Env vars: `examples/next-template/.env.example`
