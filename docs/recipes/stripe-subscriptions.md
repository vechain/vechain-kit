# Stripe Subscriptions Backend API

This document describes the backend API contract required by vechain-kit's `useSubscription` hook and `SubscriptionModal` component.

## Quick Start

1. Install Stripe Node.js SDK: `npm install stripe`
2. Implement the three endpoints below
3. Configure webhooks for billing events
4. Set `subscriptions.apiBaseUrl` in your `VeChainKitProvider`

## API Endpoints

### `GET /api/subscriptions/plans`

Returns available subscription plans.

**Response:**
```json
[
  {
    "id": "price_basic_monthly",
    "name": "Basic",
    "description": "Access to basic features",
    "amount": "9.99",
    "currency": "usd",
    "interval": "month",
    "features": ["Feature 1", "Feature 2"]
  }
]
```

### `POST /api/subscriptions`

Creates a new subscription for the authenticated user.

**Request:**
```json
{
  "planId": "price_basic_monthly",
  "paymentMethodId": "pm_card_visa"
}
```

**Response:**
```json
{
  "id": "sub_abc123",
  "planId": "price_basic_monthly",
  "status": "active",
  "currentPeriodStart": "2026-01-01T00:00:00Z",
  "currentPeriodEnd": "2026-02-01T00:00:00Z",
  "cancelAtPeriodEnd": false
}
```

### `GET /api/subscriptions/current`

Returns the authenticated user's current subscription, or 404 if none exists.

**Response (200):**
```json
{
  "id": "sub_abc123",
  "planId": "price_basic_monthly",
  "status": "active",
  "currentPeriodStart": "2026-01-01T00:00:00Z",
  "currentPeriodEnd": "2026-02-01T00:00:00Z",
  "cancelAtPeriodEnd": false
}
```

**Response (404):**
```json
{ "subscription": null }
```

### `DELETE /api/subscriptions/:id`

Cancels the subscription at period end.

**Response:**
```json
{ "status": "canceled" }
```

## Stripe Webhooks

Configure these webhook events in your Stripe Dashboard:

| Event | Action |
|---|---|
| `customer.subscription.created` | Log creation, send confirmation |
| `customer.subscription.updated` | Sync status changes |
| `customer.subscription.deleted` | Clean up access |
| `invoice.payment_succeeded` | Grant/renew access |
| `invoice.payment_failed` | Flag as past_due, notify user |

## Authentication

Your backend should authenticate requests using the user's Privy access token:

```
Authorization: Bearer <privy_access_token>
```

Verify with Privy's server SDK:
```js
const privy = new PrivyClient(appId, secretKey);
const claims = await privy.verifyAuthToken(token);
```
