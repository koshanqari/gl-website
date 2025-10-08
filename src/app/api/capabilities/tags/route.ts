import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Public API - Fetch all capability tags
export async function GET() {
  try {
    console.log('🔍 Fetching capability tags...');
    
    const result = await query(
      'SELECT tag FROM capabilities ORDER BY sort_order ASC'
    );

    console.log('✅ Found', result.rows.length, 'tags');

    // Return array of tags
    const tags = result.rows.map(row => row.tag);
    
    return NextResponse.json(tags, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('❌ Error fetching capability tags:', error);
    return NextResponse.json({ error: 'Failed to fetch capability tags' }, { status: 500 });
  }
}
