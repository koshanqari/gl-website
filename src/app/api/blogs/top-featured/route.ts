import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching top featured blog:', error);
    return NextResponse.json({ error: 'Failed to fetch top featured blog' }, { status: 500 });
  }
}
