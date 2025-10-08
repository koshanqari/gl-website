import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all testimonials
export async function GET(request: NextRequest) {
  try {
    const result = await query(
      'SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC'
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error in testimonials GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, designation, company, content, image_url, rating, featured, sort_order } = body;

    // Validate required fields
    if (!name || !designation || !company || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: name, designation, company, content' },
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

    const result = await query(
      `INSERT INTO testimonials (name, designation, company, content, image_url, rating, featured, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name,
        designation,
        company,
        content,
        image_url || null,
        rating || 5,
        featured || false,
        sort_order || 0,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error in testimonials POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
