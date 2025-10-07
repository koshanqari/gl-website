import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Cache this route for 5 minutes
export const revalidate = 300;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('top_featured', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

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
