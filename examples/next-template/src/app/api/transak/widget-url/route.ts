import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.TRANSAK_API_KEY;
const API_SECRET = process.env.TRANSAK_API_SECRET;

// Refresh Access Token API -- backend only, cached for its 7-day validity
// https://docs.transak.com/api/public/refresh-access-token
const REFRESH_TOKEN_URL = 'https://api-stg.transak.com/partners/api/v2/refresh-token';
// Create Widget URL API -- backend only
// https://docs.transak.com/api/public/create-widget-url
const CREATE_WIDGET_URL = 'https://api-gateway-stg.transak.com/api/v2/auth/session';

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
    if (cachedToken && cachedToken.expiresAt * 1000 > Date.now() + 60_000) {
        return cachedToken.accessToken;
    }

    const res = await fetch(REFRESH_TOKEN_URL, {
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
    cachedToken = {
        accessToken: json.data.accessToken as string,
        expiresAt: json.data.expiresAt as number,
    };
    return cachedToken.accessToken;
}

export async function POST(req: NextRequest) {
    if (!API_KEY || !API_SECRET) {
        return NextResponse.json(
            { error: 'TRANSAK_API_KEY and TRANSAK_API_SECRET must be set on the server.' },
            { status: 400 },
        );
    }

    let body: { widgetParams?: Record<string, unknown> };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const widgetParams = body.widgetParams;
    if (!widgetParams) {
        return NextResponse.json({ error: 'widgetParams is required.' }, { status: 400 });
    }

    const forwardedFor = req.headers.get('x-forwarded-for');
    const userIp = forwardedFor?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? '';

    try {
        const accessToken = await getAccessToken();

        const res = await fetch(CREATE_WIDGET_URL, {
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
