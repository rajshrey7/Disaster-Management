import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const district = searchParams.get('district');
    const state = searchParams.get('state') || 'Punjab';
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive') !== 'false';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const whereClause: any = {
      isActive: true
    };

    // Filter by district and state
    if (district) {
      whereClause.district = district;
    }
    
    if (state) {
      whereClause.state = state;
    }

    // Filter by category
    if (category) {
      whereClause.category = category;
    }

    // Filter by active status
    if (isActive !== null) {
      whereClause.isActive = isActive;
    }

    // Fetch emergency contacts
    const contacts = await db.emergencyContact.findMany({
      where: whereClause,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ],
      take: limit,
      skip: offset
    });

    // Enhanced response with parsed JSON fields
    const enhancedContacts = contacts.map(contact => ({
      ...contact,
      alternateNumbers: contact.alternateNumbers ? JSON.parse(contact.alternateNumbers) : [],
      socialMedia: contact.socialMedia ? JSON.parse(contact.socialMedia) : [],
      specializations: contact.specializations ? JSON.parse(contact.specializations) : []
    }));

    return NextResponse.json({
      success: true,
      data: enhancedContacts,
      pagination: {
        limit,
        offset,
        total: enhancedContacts.length,
        hasMore: enhancedContacts.length === limit
      },
      filters: {
        district,
        state,
        category,
        isActive
      }
    });

  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch emergency contacts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      number,
      category,
      description,
      available24x7,
      location,
      website,
      state,
      district,
      city,
      alternateNumbers,
      email,
      socialMedia,
      responseTime,
      coverageArea,
      specializations
    } = body;

    // Validate required fields
    if (!name || !number || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, number, category' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = [
      'POLICE', 'FIRE', 'AMBULANCE', 'HOSPITAL', 'CIVIL_DEFENSE',
      'NDMA', 'STATE_DISASTER_MANAGEMENT', 'DISTRICT_EMERGENCY_OPERATIONS',
      'LOCAL_ADMINISTRATION', 'UTILITY_SERVICES', 'TRANSPORT',
      'COMMUNICATION', 'VOLUNTEER_ORGANIZATIONS'
    ];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: ' + validCategories.join(', ') },
        { status: 400 }
      );
    }

    // Create emergency contact
    const contact = await db.emergencyContact.create({
      data: {
        name,
        number,
        category,
        description: description || null,
        available24x7: available24x7 !== false,
        location: location || null,
        website: website || null,
        state: state || 'Punjab',
        district: district || null,
        city: city || null,
        alternateNumbers: alternateNumbers ? JSON.stringify(alternateNumbers) : null,
        email: email || null,
        socialMedia: socialMedia ? JSON.stringify(socialMedia) : null,
        responseTime: responseTime || null,
        coverageArea: coverageArea || null,
        specializations: specializations ? JSON.stringify(specializations) : null,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Emergency contact created successfully',
      data: {
        ...contact,
        alternateNumbers: contact.alternateNumbers ? JSON.parse(contact.alternateNumbers) : [],
        socialMedia: contact.socialMedia ? JSON.parse(contact.socialMedia) : [],
        specializations: contact.specializations ? JSON.parse(contact.specializations) : []
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating emergency contact:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create emergency contact',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}