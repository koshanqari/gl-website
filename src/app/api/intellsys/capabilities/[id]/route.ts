import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Admin API - Get single capability by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const result = await query(
      'SELECT * FROM capabilities WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Capability not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching capability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Admin API - Update capability
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const result = await query(
      `UPDATE capabilities 
       SET image_url = $1, image_text = $2, title = $3, tag = $4, 
           description = $5, features = $6, sort_order = $7, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $8 
       RETURNING *`,
      [
        body.image_url,
        body.image_text,
        body.title,
        body.tag,
        body.description,
        JSON.stringify(body.features),
        body.sort_order,
        id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Capability not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating capability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Admin API - Delete capability
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const result = await query(
      'DELETE FROM capabilities WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Capability not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting capability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
