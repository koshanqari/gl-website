import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Leads API - Multi-Step Form Submission
 * 
 * DATABASE COMPATIBILITY:
 * - Currently uses Supabase (PostgreSQL wrapper)
 * - Can be migrated to any PostgreSQL database
 * - To switch databases: Replace supabaseAdmin calls with direct SQL queries
 * 
 * Table: leads (was contact_inquiries)
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { step, leadId, utm } = body;

    // Multi-step form handling
    if (step) {
      return handleMultiStepSubmission(body, step, leadId, utm);
    }

    // Legacy single-form submission (backward compatibility)
    return handleLegacySubmission(body, utm);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleMultiStepSubmission(body: any, step: number, leadId?: number, utm?: any) {
  try {
    let updateData: any = {};

    // Step 1: Basic Contact Info
    if (step === 1) {
      const { name, email, phone, company } = body;
      if (!name || !email) {
        return NextResponse.json(
          { error: 'Name and email are required' },
          { status: 400 }
        );
      }

      updateData = {
        name,
        email,
        phone: phone || null,
        company: company || null,
        step1_completed_at: new Date().toISOString(),
        lead_source: body.leadSource || 'form',
        ...(utm && {
          utm_source: utm.source || null,
          utm_medium: utm.medium || null,
          utm_campaign: utm.campaign || null,
          utm_content: utm.content || null,
          utm_term: utm.term || null
        })
      };
    }

    // Step 2: Meeting Preferences
    if (step === 2) {
      const { preferredConnectDate, preferredConnectTime, preferredConnectMode } = body;

      updateData = {
        preferred_connect_date: preferredConnectDate || null,
        preferred_connect_time: preferredConnectTime || null,
        preferred_connect_mode: preferredConnectMode || null,
        step2_completed_at: new Date().toISOString()
      };
    }

    // Step 3: Event Details
    if (step === 3) {
      const { eventType, eventDate, eventCountry, eventPincode, eventRegion, eventCity, guestCount, additionalDetails } = body;
      
      if (!eventType || !additionalDetails) {
        return NextResponse.json(
          { error: 'Event type and additional details are required' },
          { status: 400 }
        );
      }

      updateData = {
        event_type: eventType,
        event_date: eventDate || null,
        event_country: eventCountry || null,
        event_pincode: eventPincode || null,
        event_region: eventRegion || null,
        event_city: eventCity || null,
        guest_count: guestCount ? parseInt(guestCount) : null,
        additional_details: additionalDetails,
        step3_completed_at: new Date().toISOString(),
        status: 'new',
        priority: 'medium'
      };
    }

    // UPSERT: Update if leadId exists, otherwise insert
    if (leadId) {
      // Update existing lead
      const { data, error } = await supabaseAdmin
        .from('leads')
        .update(updateData)
        .eq('id', leadId)
        .select()
        .single();

      if (error) {
        console.error('Error updating lead:', error);
        return NextResponse.json(
          { error: 'Failed to update lead' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Step ${step} saved successfully`,
        leadId: data.id,
        stepCompleted: step
      });
    } else {
      // Create new lead (step 1 only)
      const { data, error } = await supabaseAdmin
        .from('leads')
        .insert([updateData])
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        return NextResponse.json(
          { error: 'Failed to create lead' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Step ${step} saved successfully`,
        leadId: data.id,
        stepCompleted: step
      });
    }
  } catch (error) {
    console.error('Multi-step error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}

// Legacy single-form submission handler (backward compatibility)
async function handleLegacySubmission(body: any, utm?: any) {
  const { name, email, eventType, additionalDetails } = body;
  if (!name || !email || !eventType || !additionalDetails) {
    return NextResponse.json(
      { error: 'Missing required fields: name, email, eventType, additionalDetails' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert([{
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      company: body.company || null,
      event_type: body.eventType,
      event_date: body.eventDate || null,
      event_country: body.eventCountry || null,
      event_pincode: body.eventPincode || null,
      event_region: body.eventRegion || null,
      event_city: body.eventCity || null,
      guest_count: body.guestCount ? parseInt(body.guestCount) : null,
      additional_details: body.additionalDetails,
      preferred_connect_date: body.preferredConnectDate || null,
      preferred_connect_time: body.preferredConnectTime || null,
      preferred_connect_mode: body.preferredConnectMode || null,
      status: 'new',
      priority: 'medium',
      lead_source: body.leadSource || 'form',
      step1_completed_at: new Date().toISOString(),
      step2_completed_at: new Date().toISOString(),
      step3_completed_at: new Date().toISOString(),
      ...(utm && {
        utm_source: utm.source || null,
        utm_medium: utm.medium || null,
        utm_campaign: utm.campaign || null,
        utm_content: utm.content || null,
        utm_term: utm.term || null
      })
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Lead submitted successfully',
    leadId: data.id 
  });
}
