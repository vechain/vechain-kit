import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.TRANSAK_API_KEY;
const API_SECRET = process.env.TRANSAK_API_SECRET;

type TransakEnvironment = 'staging' | 'production';

// Refresh Access Token API -- backend only, cached for its 7-day validity
// https://docs.transak.com/api/public/refresh-access-token
// Create Widget URL API -- backend only
// https://docs.transak.com/api/public/create-widget-url
const ENV_URLS: Record<
    TransakEnvironment,
    { refreshToken: string; createWidget: string }
> = {
    staging: {
        refreshToken: 'https://api-stg.transak.com/partners/api/v2/refresh-token',
        createWidget: 'https://api-gateway-stg.transak.com/api/v2/auth/session',
    },
    production: {
        refreshToken: 'https://api.transak.com/partners/api/v2/refresh-token',
        createWidget: 'https://api-gateway.transak.com/api/v2/auth/session',
    },
};

// Access tokens are environment-specific -- cache per environment so a staging
// token is never replayed against production endpoints.
const cachedTokens: Record<TransakEnvironment, { accessToken: string; expiresAt: number } | null> = {
    staging: null,
    production: null,
};

// Simple in-memory rate limit so unauthenticated callers cannot mint
// unlimited Transak sessions against the server credentials.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const requestLog: Record<string, number[]> = {};

function rateLimited(ip: string): boolean {
    const now = Date.now();
    const hits = (requestLog[ip] ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (hits.length >= RATE_LIMIT_MAX) {
        requestLog[ip] = hits;
        return true;
    }
    hits.push(now);
    requestLog[ip] = hits;
    return false;
}

const PRIVATE_IP_PREFIXES = ['10.', '172.16.', '172.17.', '172.18.', '172.19.', '172.20.', '172.21.', '172.22.', '172.23.', '172.24.', '172.25.', '172.26.', '172.27.', '172.28.', '172.29.', '172.30.', '172.31.', '192.168.', '127.', '169.254.', '::1', 'fc', 'fd'];

function isPrivateIp(ip: string): boolean {
    const trimmed = ip.trim().toLowerCase();
    return PRIVATE_IP_PREFIXES.some((p) => trimmed.startsWith(p));
}

function resolveClientIp(req: NextRequest): string {
    const realIp = req.headers.get('x-real-ip');
    if (realIp && !isPrivateIp(realIp)) {
        return realIp.trim();
    }
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
        const leftmost = forwardedFor.split(',')[0]?.trim();
        if (leftmost && !isPrivateIp(leftmost)) {
            return leftmost;
        }
    }
    return 'unknown';
}

async function fetchWithTimeout(
    url: string,
    init: RequestInit,
    timeoutMs = 10_000,
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { ...init, signal: controller.signal });
    } catch (err) {
        if (controller.signal.aborted) {
            throw new Error(`Transak request timed out after ${timeoutMs}ms`);
        }
        throw err;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function getAccessToken(environment: TransakEnvironment): Promise<string> {
    const cached = cachedTokens[environment];
    if (cached && cached.expiresAt * 1000 > Date.now() + 60_000) {
        return cached.accessToken;
    }

    const res = await fetchWithTimeout(ENV_URLS[environment].refreshToken, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY!,
            'api-secret': API_SECRET!,
        },
        body: JSON.stringify({ apiKey: API_KEY }),
    });

    if (!res.ok) {
        throw new Error(`Transak refresh-token failed: ${res.status}`);
    }

    const json = await res.json();
    cachedTokens[environment] = {
        accessToken: json.data.accessToken as string,
        expiresAt: json.data.expiresAt as number,
    };
    return cachedTokens[environment]!.accessToken;
}

export async function POST(req: NextRequest) {
    if (!API_KEY || !API_SECRET) {
        return NextResponse.json(
            { error: 'TRANSAK_API_KEY and TRANSAK_API_SECRET must be set on the server.' },
            { status: 400 },
        );
    }

    let body: { widgetParams?: Record<string, unknown>; environment?: unknown };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const widgetParams = body.widgetParams;
    if (!widgetParams) {
        return NextResponse.json({ error: 'widgetParams is required.' }, { status: 400 });
    }

    const environment = body.environment;
    if (environment !== 'staging' && environment !== 'production') {
        return NextResponse.json(
            { error: "environment must be 'staging' or 'production'." },
            { status: 400 },
        );
    }

    const userIp = resolveClientIp(req);

    if (rateLimited(userIp)) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 },
        );
    }

    try {
        const accessToken = await getAccessToken(environment);

        const res = await fetchWithTimeout(ENV_URLS[environment].createWidget, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'access-token': accessToken,
                'x-user-ip': userIp,
            },
            body: JSON.stringify({ widgetParams }),
        });

        const json = await res.json();
        if (!res.ok) {
            return NextResponse.json(
                { error: json?.error?.message ?? `Transak create-widget-url failed: ${res.status}` },
                { status: res.status },
            );
        }

        return NextResponse.json(json);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
