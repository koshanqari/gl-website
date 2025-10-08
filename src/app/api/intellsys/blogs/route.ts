import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all blogs
export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM blogs ORDER BY created_at DESC'
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST new blog
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const result = await query(
      `INSERT INTO blogs (
        title, excerpt, content, image_url, category, 
        date, read_time, author, featured, top_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        body.title,
        body.excerpt,
        body.content,
        body.image_url,
        body.category,
        body.date,
        body.read_time,
        body.author,
        body.featured || false,
        body.top_featured || false
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

