import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch single testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonialId = parseInt(id);

    if (isNaN(testimonialId)) {
      return NextResponse.json({ error: 'Invalid testimonial ID' }, { status: 400 });
    }

    const result = await query(
      'SELECT * FROM testimonials WHERE id = $1',
      [testimonialId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error in testimonial GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonialId = parseInt(id);

    if (isNaN(testimonialId)) {
      return NextResponse.json({ error: 'Invalid testimonial ID' }, { status: 400 });
    }

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
      `UPDATE testimonials 
       SET name = $1, designation = $2, company = $3, content = $4, 
           image_url = $5, rating = $6, featured = $7, sort_order = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        name,
        designation,
        company,
        content,
        image_url || null,
        rating || 5,
        featured || false,
        sort_order !== undefined ? sort_order : 0,
        testimonialId,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error in testimonial PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonialId = parseInt(id);

    if (isNaN(testimonialId)) {
      return NextResponse.json({ error: 'Invalid testimonial ID' }, { status: 400 });
    }

    const result = await query(
      'DELETE FROM testimonials WHERE id = $1',
      [testimonialId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error in testimonial DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
