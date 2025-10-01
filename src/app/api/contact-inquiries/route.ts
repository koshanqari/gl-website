import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, email, eventType, message } = body;
    if (!name || !email || !eventType || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, eventType, message' },
        { status: 400 }
      );
    }

    // Insert contact inquiry
    const { data, error } = await supabaseAdmin
      .from('contact_inquiries')
      .insert([{
        name: body.name,
        email: body.email,
        company: body.company || null,
        phone: body.phone || null,
        country: body.country || 'India',
        pincode: body.pincode || null,
        state: body.state || null,
        city: body.city || null,
        event_type: body.eventType,
        event_date: body.eventDate || null,
        budget: body.budget || null,
        guest_count: body.guestCount ? parseInt(body.guestCount) : null,
        message: body.message,
        status: 'new',
        priority: 'medium'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating contact inquiry:', error);
      return NextResponse.json(
        { error: 'Failed to submit inquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Inquiry submitted successfully',
      id: data.id 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
