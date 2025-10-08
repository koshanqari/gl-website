import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Cache this route for 5 minutes
export const revalidate = 300;

export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM work WHERE featured = true ORDER BY created_at DESC LIMIT 3'
    );

    return NextResponse.json(result.rows, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error fetching featured work:', error);
    return NextResponse.json({ error: 'Failed to fetch featured work' }, { status: 500 });
  }
}
