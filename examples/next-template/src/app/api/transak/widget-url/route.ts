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

async function getAccessToken(environment: TransakEnvironment): Promise<string> {
    const cached = cachedTokens[environment];
    if (cached && cached.expiresAt * 1000 > Date.now() + 60_000) {
        return cached.accessToken;
    }

    const res = await fetch(ENV_URLS[environment].refreshToken, {
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

    const forwardedFor = req.headers.get('x-forwarded-for');
    const userIp = forwardedFor?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? '';

    try {
        const accessToken = await getAccessToken(environment);

        const res = await fetch(ENV_URLS[environment].createWidget, {
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
