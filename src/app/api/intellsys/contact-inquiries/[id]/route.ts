import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const { data: inquiry, error } = await supabaseAdmin
      .from('contact_inquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching contact inquiry:', error);
      return NextResponse.json({ error: 'Failed to fetch inquiry' }, { status: 500 });
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { data, error } = await supabaseAdmin
      .from('contact_inquiries')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact inquiry:', error);
      return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const { error } = await supabaseAdmin
      .from('contact_inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact inquiry:', error);
      return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
