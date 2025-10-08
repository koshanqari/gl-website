import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Admin API - Fetch all leads
export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM leads ORDER BY created_at DESC'
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// Admin API - Create new lead manually
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const leadData = {
      ...body,
      lead_source: body.lead_source || 'manual',
      step1_completed_at: new Date().toISOString(),
      step2_completed_at: new Date().toISOString(),
      step3_completed_at: new Date().toISOString()
    };

    const keys = Object.keys(leadData);
    const values = Object.values(leadData);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const result = await query(
      `INSERT INTO leads (${keys.join(', ')}) 
       VALUES (${placeholders}) 
       RETURNING *`,
      values
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
