import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch public testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    let query = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by featured if specified
    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching testimonials:', error);
      return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in testimonials GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
