import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all work
export async function GET() {
  try {
    const result = await query('SELECT * FROM work ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching work:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work' },
      { status: 500 }
    );
  }
}

// POST new work
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, image_url, category, date, client, attendees, location, featured } = body;
    
    // Validate required fields
    if (!title || !description || !image_url || !category || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, image_url, category, date' },
        { status: 400 }
      );
    }
    
    const result = await query(
      `INSERT INTO work (title, description, image_url, category, date, client, attendees, location, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        title,
        description,
        image_url,
        category,
        date,
        client || null,
        attendees || null,
        location || null,
        featured || false
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating work:', error);
    return NextResponse.json(
      { error: 'Failed to create work' },
      { status: 500 }
    );
  }
}

