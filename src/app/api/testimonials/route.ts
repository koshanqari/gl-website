import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Cache this route for 5 minutes
export const revalidate = 300;

// GET - Fetch public testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    let sql = 'SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC';
    let params: any[] = [];

    // Filter by featured if specified
    if (featured === 'true') {
      sql = 'SELECT * FROM testimonials WHERE featured = true ORDER BY sort_order ASC, created_at DESC';
    }

    const result = await query(sql, params);

    return NextResponse.json(result.rows, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error in testimonials GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
