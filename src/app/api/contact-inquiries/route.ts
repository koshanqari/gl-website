import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * Leads API - Multi-Step Form Submission
 * 
 * DATABASE: PostgreSQL (direct connection)
 * Table: leads
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
      if (!name || !phone) {
        return NextResponse.json(
          { error: 'Name and phone are required' },
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
        preferred_connect_mode: preferredConnectMode && preferredConnectMode.length > 0 
          ? JSON.stringify(preferredConnectMode) 
          : null,
        step2_completed_at: new Date().toISOString()
      };
    }

    // Step 3: Project Details
    if (step === 3) {
      const { serviceType, projectDate, projectCountry, projectPincode, projectRegion, projectCity, targetCount, additionalDetails } = body;
      
      if (!serviceType || !Array.isArray(serviceType) || serviceType.length === 0) {
        return NextResponse.json(
          { error: 'Service type (at least one) is required' },
          { status: 400 }
        );
      }

      updateData = {
        service_type: JSON.stringify(serviceType),
        project_date: projectDate || null,
        project_country: projectCountry || null,
        project_pincode: projectPincode || null,
        project_region: projectRegion || null,
        project_city: projectCity || null,
        target_count: targetCount ? parseInt(targetCount) : null,
        additional_details: additionalDetails,
        step3_completed_at: new Date().toISOString(),
        status: 'new',
        priority: 'medium'
      };
    }

    // UPSERT: Update if leadId exists, otherwise insert
    if (leadId) {
      // Update existing lead
      const keys = Object.keys(updateData);
      const values = Object.values(updateData);
      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
      
      const result = await query(
        `UPDATE leads SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $${keys.length + 1} 
         RETURNING *`,
        [...values, leadId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Lead not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Step ${step} saved successfully`,
        leadId: result.rows[0].id,
        stepCompleted: step
      });
    } else {
      // Create new lead (step 1 only)
      const keys = Object.keys(updateData);
      const values = Object.values(updateData);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      
      const result = await query(
        `INSERT INTO leads (${keys.join(', ')}) 
         VALUES (${placeholders}) 
         RETURNING *`,
        values
      );

      return NextResponse.json({
        success: true,
        message: `Step ${step} saved successfully`,
        leadId: result.rows[0].id,
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
  const { name, phone, serviceType } = body;
  if (!name || !phone || !serviceType) {
    return NextResponse.json(
      { error: 'Missing required fields: name, phone, serviceType' },
      { status: 400 }
    );
  }

  const result = await query(
    `INSERT INTO leads (
      name, email, phone, company, service_type, project_date, 
      project_country, project_pincode, project_region, project_city, 
      target_count, additional_details, preferred_connect_date, 
      preferred_connect_time, preferred_connect_mode, status, priority, 
      lead_source, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      step1_completed_at, step2_completed_at, step3_completed_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
      $16, $17, $18, $19, $20, $21, $22, $23, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    [
      body.name,
      body.email,
      body.phone || null,
      body.company || null,
      body.serviceType ? JSON.stringify(body.serviceType) : null,
      body.projectDate || null,
      body.projectCountry || null,
      body.projectPincode || null,
      body.projectRegion || null,
      body.projectCity || null,
      body.targetCount ? parseInt(body.targetCount) : null,
      body.additionalDetails,
      body.preferredConnectDate || null,
      body.preferredConnectTime || null,
      body.preferredConnectMode ? JSON.stringify(body.preferredConnectMode) : null,
      'new',
      'medium',
      body.leadSource || 'form',
      utm?.source || null,
      utm?.medium || null,
      utm?.campaign || null,
      utm?.content || null,
      utm?.term || null
    ]
  );

  return NextResponse.json({ 
    success: true, 
    message: 'Lead submitted successfully',
    leadId: result.rows[0].id 
  });
}
