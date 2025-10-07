import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Cache this route for 5 minutes
export const revalidate = 300;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('work')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw error;

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error fetching featured work:', error);
    return NextResponse.json({ error: 'Failed to fetch featured work' }, { status: 500 });
  }
}
