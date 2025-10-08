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
    console.log('Received body:', body);
    
    // Filter out undefined, null, and empty string values
    const cleanedBody = Object.fromEntries(
      Object.entries(body).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    );
    
    // Convert arrays to JSON strings for PostgreSQL JSONB columns
    const processedBody: Record<string, any> = {};
    for (const [key, value] of Object.entries(cleanedBody)) {
      if (Array.isArray(value)) {
        processedBody[key] = JSON.stringify(value);
      } else {
        processedBody[key] = value;
      }
    }
    
    const leadData = {
      ...processedBody,
      lead_source: processedBody.lead_source || 'manual',
      status: processedBody.status || 'new',
      priority: processedBody.priority || 'medium',
      step1_completed_at: new Date().toISOString(),
      step2_completed_at: new Date().toISOString(),
      step3_completed_at: new Date().toISOString()
    };

    console.log('Prepared leadData:', leadData);

    const keys = Object.keys(leadData);
    const values = Object.values(leadData);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    console.log('SQL:', `INSERT INTO leads (${keys.join(', ')}) VALUES (${placeholders})`);
    console.log('Values:', values);

    const result = await query(
      `INSERT INTO leads (${keys.join(', ')}) 
       VALUES (${placeholders}) 
       RETURNING *`,
      values
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating lead:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    return NextResponse.json({ 
      error: 'Failed to create lead',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
