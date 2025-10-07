import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Admin API - Fetch all leads
export async function GET() {
  try {
    const { data: leads, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Admin API - Create new lead manually
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([{
        ...body,
        lead_source: body.lead_source || 'manual',
        step1_completed_at: new Date().toISOString(),
        step2_completed_at: new Date().toISOString(),
        step3_completed_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
