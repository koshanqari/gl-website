import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Admin API - Get single lead by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const result = await query(
      'SELECT * FROM leads WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Admin API - Update lead
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Remove system fields that shouldn't be updated manually
    const { id: _, created_at, updated_at, step1_completed_at, step2_completed_at, step3_completed_at, ...updateData } = body;
    
    // Convert arrays to JSON strings for PostgreSQL JSONB columns
    const processedData: Record<string, any> = {};
    for (const [key, value] of Object.entries(updateData)) {
      if (Array.isArray(value)) {
        processedData[key] = JSON.stringify(value);
      } else {
        processedData[key] = value;
      }
    }
    
    const keys = Object.keys(processedData);
    const values = Object.values(processedData);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const result = await query(
      `UPDATE leads 
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${keys.length + 1} 
       RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Admin API - Delete lead
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const result = await query(
      'DELETE FROM leads WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
