import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, Testimonial } from '@/lib/supabase';

// GET - Fetch all testimonials
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

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

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, company, content, avatar_url, rating, featured } = body;

    // Validate required fields
    if (!name || !position || !company || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: name, position, company, content' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert([
        {
          name,
          position,
          company,
          content,
          avatar_url: avatar_url || null,
          rating: rating || 5,
          featured: featured || false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating testimonial:', error);
      return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in testimonials POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
