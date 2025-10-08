import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Admin API - Fetch all capabilities
export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM capabilities ORDER BY sort_order ASC'
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching capabilities:', error);
    return NextResponse.json({ error: 'Failed to fetch capabilities' }, { status: 500 });
  }
}

// Admin API - Create new capability
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const result = await query(
      `INSERT INTO capabilities (
        image_url, image_text, title, tag, description, 
        features, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [
        body.image_url,
        body.image_text,
        body.title,
        body.tag,
        body.description,
        JSON.stringify(body.features),
        body.sort_order || 0
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating capability:', error);
    return NextResponse.json({ error: 'Failed to create capability' }, { status: 500 });
  }
}
