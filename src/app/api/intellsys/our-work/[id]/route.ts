import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET single work
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workId = parseInt(id);

    if (isNaN(workId)) {
      return NextResponse.json({ error: 'Invalid work ID' }, { status: 400 });
    }

    const result = await query('SELECT * FROM work WHERE id = $1', [workId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching work:', error);
    return NextResponse.json(
      { error: 'Work not found' },
      { status: 404 }
    );
  }
}

// PUT update work
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workId = parseInt(id);

    if (isNaN(workId)) {
      return NextResponse.json({ error: 'Invalid work ID' }, { status: 400 });
    }

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
      `UPDATE work 
       SET title = $1, description = $2, image_url = $3, category = $4, date = $5,
           client = $6, attendees = $7, location = $8, featured = $9, updated_at = NOW()
       WHERE id = $10
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
        featured || false,
        workId
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating work:', error);
    return NextResponse.json(
      { error: 'Failed to update work' },
      { status: 500 }
    );
  }
}

// DELETE work
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workId = parseInt(id);

    if (isNaN(workId)) {
      return NextResponse.json({ error: 'Invalid work ID' }, { status: 400 });
    }

    const result = await query('DELETE FROM work WHERE id = $1', [workId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting work:', error);
    return NextResponse.json(
      { error: 'Failed to delete work' },
      { status: 500 }
    );
  }
}

