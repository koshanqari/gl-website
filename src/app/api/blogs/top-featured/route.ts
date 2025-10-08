import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Cache this route for 5 minutes
export const revalidate = 300;

export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM blogs WHERE top_featured = true ORDER BY created_at DESC LIMIT 1'
    );

    const data = result.rows[0] || null;

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error fetching top featured blog:', error);
    return NextResponse.json({ error: 'Failed to fetch top featured blog' }, { status: 500 });
  }
}
