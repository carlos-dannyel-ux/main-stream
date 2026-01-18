import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: 'API key not configured' },
            { status: 500 }
        );
    }

    const endpoint = path.join('/');
    const searchParams = request.nextUrl.searchParams;

    // Build URL with query params
    const url = new URL(`${TMDB_BASE_URL}/${endpoint}`);
    searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
    });
    url.searchParams.append('api_key', apiKey);

    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `TMDB API error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('TMDB API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch from TMDB' },
            { status: 500 }
        );
    }
}
