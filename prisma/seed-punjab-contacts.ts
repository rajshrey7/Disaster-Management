import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📞 Seeding Punjab Emergency Contacts...');

  // Punjab emergency contacts data
  const contacts = [
    // PSDMA - Punjab State Disaster Management Authority
    {
      name: 'PSDMA Emergency Control Room',
      number: '1070',
      category: 'STATE_DISASTER_MANAGEMENT',
      description: 'Punjab State Disaster Management Authority - 24x7 Emergency Control Room',
      available24x7: true,
      state: 'Punjab',
      district: 'Chandigarh',
      city: 'Chandigarh',
      location: 'PSDMA Headquarters, Sector 17, Chandigarh',
      website: 'https://psdma.punjab.gov.in',
      responseTime: 'Immediate response',
      coverageArea: 'Entire Punjab State',
      specializations: ['Disaster Response', 'Emergency Coordination', 'Relief Operations']
    },
    {
      name: 'PSDMA Director General',
      number: '0172-2700001',
      category: 'STATE_DISASTER_MANAGEMENT',
      description: 'PSDMA Director General Office',
      available24x7: false,
      state: 'Punjab',
      district: 'Chandigarh',
      city: 'Chandigarh',
      location: 'PSDMA Headquarters, Sector 17, Chandigarh',
      website: 'https://psdma.punjab.gov.in',
      responseTime: 'Within 30 minutes',
      coverageArea: 'Entire Punjab State',
      specializations: ['Administrative', 'Policy Making', 'Strategic Planning']
    },

    // Ludhiana District
    {
      name: 'Ludhiana District Emergency Control Room',
      number: '0161-2440000',
      category: 'DISTRICT_EMERGENCY_OPERATIONS',
      description: 'Ludhiana District Emergency Operations Center',
      available24x7: true,
      state: 'Punjab',
      district: 'Ludhiana',
      city: 'Ludhiana',
      location: 'District Administrative Complex, Ludhiana',
      website: 'https://ludhiana.nic.in',
      responseTime: 'Within 15 minutes',
      coverageArea: 'Ludhiana District',
      specializations: ['District Coordination', 'Local Emergency Response', 'Resource Management']
    },
    {
      name: 'Ludhiana Police Control Room',
      number: '100',
      category: 'POLICE',
      description: 'Ludhiana Police Emergency Control Room',
      available24x7: true,
      state: 'Punjab',
      district: 'Ludhiana',
      city: 'Ludhiana',
      location: 'Commissionerate Office, Ludhiana',
      website: 'https://punjabpolice.gov.in',
      responseTime: 'Immediate response',
      coverageArea: 'Ludhiana District',
      specializations: ['Law Enforcement', 'Crime Prevention', 'Traffic Management']
    },
    {
      name: 'Ludhiana Fire Station',
      number: '101',
      category: 'FIRE',
      description: 'Ludhiana Fire and Rescue Services',
      available24x7: true,
      state: 'Punjab',
      district: 'Ludhiana',
      city: 'Ludhiana',
      location: 'Fire Station, Civil Lines, Ludhiana',
      website: '',
      responseTime: 'Within 5 minutes',
      coverageArea: 'Ludhiana District',
      specializations: ['Fire Fighting', 'Rescue Operations', 'Fire Safety']
    },
    {
      name: 'Ludhiana Civil Hospital',
      number: '0161-2440001',
      category: 'HOSPITAL',
      description: 'Ludhiana Civil Hospital Emergency Services',
      available24x7: true,
      state: 'Punjab',
      district: 'Ludhiana',
      city: 'Ludhiana',
      location: 'Civil Hospital, Ludhiana',
      website: 'https://ludhiana.nic.in',
      responseTime: 'Within 10 minutes',
      coverageArea: 'Ludhiana District',
      specializations: ['Emergency Medicine', 'Trauma Care', 'Critical Care']
    },

    // Amritsar District
    {
      name: 'Amritsar District Emergency Control Room',
      number: '0183-2220000',
      category: 'DISTRICT_EMERGENCY_OPERATIONS',
      description: 'Amritsar District Emergency Operations Center',
      available24x7: true,
      state: 'Punjab',
      district: 'Amritsar',
      city: 'Amritsar',
      location: 'District Administrative Complex, Amritsar',
      website: 'https://amritsar.nic.in',
      responseTime: 'Within 15 minutes',
      coverageArea: 'Amritsar District',
      specializations: ['District Coordination', 'Local Emergency Response', 'Resource Management']
    },
    {
      name: 'Amritsar Police Control Room',
      number: '100',
      category: 'POLICE',
      description: 'Amritsar Police Emergency Control Room',
      available24x7: true,
      state: 'Punjab',
      district: 'Amritsar',
      city: 'Amritsar',
      location: 'Commissionerate Office, Amritsar',
      website: 'https://punjabpolice.gov.in',
      responseTime: 'Immediate response',
      coverageArea: 'Amritsar District',
      specializations: ['Law Enforcement', 'Crime Prevention', 'Traffic Management']
    },
    {
      name: 'Amritsar Fire Station',
      number: '101',
      category: 'FIRE',
      description: 'Amritsar Fire and Rescue Services',
      available24x7: true,
      state: 'Punjab',
      district: 'Amritsar',
      city: 'Amritsar',
      location: 'Fire Station, Amritsar',
      website: '',
      responseTime: 'Within 5 minutes',
      coverageArea: 'Amritsar District',
      specializations: ['Fire Fighting', 'Rescue Operations', 'Fire Safety']
    },

    // Chandigarh
    {
      name: 'Chandigarh Emergency Control Room',
      number: '0172-2700000',
      category: 'DISTRICT_EMERGENCY_OPERATIONS',
      description: 'Chandigarh Union Territory Emergency Control Room',
      available24x7: true,
      state: 'Chandigarh',
      district: 'Chandigarh',
      city: 'Chandigarh',
      location: 'UT Secretariat, Sector 9, Chandigarh',
      website: 'https://chandigarh.gov.in',
      responseTime: 'Within 10 minutes',
      coverageArea: 'Chandigarh UT',
      specializations: ['UT Coordination', 'Emergency Response', 'Resource Management']
    },
    {
      name: 'Chandigarh Police Control Room',
      number: '100',
      category: 'POLICE',
      description: 'Chandigarh Police Emergency Control Room',
      available24x7: true,
      state: 'Chandigarh',
      district: 'Chandigarh',
      city: 'Chandigarh',
      location: 'Police Headquarters, Sector 9, Chandigarh',
      website: 'https://chandigarhpolice.gov.in',
      responseTime: 'Immediate response',
      coverageArea: 'Chandigarh UT',
      specializations: ['Law Enforcement', 'Crime Prevention', 'Traffic Management']
    },

    // Jalandhar District
    {
      name: 'Jalandhar District Emergency Control Room',
      number: '0181-2220000',
      category: 'DISTRICT_EMERGENCY_OPERATIONS',
      description: 'Jalandhar District Emergency Operations Center',
      available24x7: true,
      state: 'Punjab',
      district: 'Jalandhar',
      city: 'Jalandhar',
      location: 'District Administrative Complex, Jalandhar',
      website: 'https://jalandhar.nic.in',
      responseTime: 'Within 15 minutes',
      coverageArea: 'Jalandhar District',
      specializations: ['District Coordination', 'Local Emergency Response', 'Resource Management']
    },

    // Patiala District
    {
      name: 'Patiala District Emergency Control Room',
      number: '0175-2220000',
      category: 'DISTRICT_EMERGENCY_OPERATIONS',
      description: 'Patiala District Emergency Operations Center',
      available24x7: true,
      state: 'Punjab',
      district: 'Patiala',
      city: 'Patiala',
      location: 'District Administrative Complex, Patiala',
      website: 'https://patiala.nic.in',
      responseTime: 'Within 15 minutes',
      coverageArea: 'Patiala District',
      specializations: ['District Coordination', 'Local Emergency Response', 'Resource Management']
    },

    // Bathinda District
    {
      name: 'Bathinda District Emergency Control Room',
      number: '0164-2220000',
      category: 'DISTRICT_EMERGENCY_OPERATIONS',
      description: 'Bathinda District Emergency Operations Center',
      available24x7: true,
      state: 'Punjab',
      district: 'Bathinda',
      city: 'Bathinda',
      location: 'District Administrative Complex, Bathinda',
      website: 'https://bathinda.nic.in',
      responseTime: 'Within 15 minutes',
      coverageArea: 'Bathinda District',
      specializations: ['District Coordination', 'Local Emergency Response', 'Resource Management']
    },

    // National Emergency Numbers
    {
      name: 'National Emergency Number',
      number: '112',
      category: 'CIVIL_DEFENSE',
      description: 'All-in-one emergency number for police, fire, and ambulance',
      available24x7: true,
      state: 'Punjab',
      district: null,
      city: null,
      location: 'Pan India',
      website: 'https://www.112.gov.in',
      responseTime: 'Immediate response',
      coverageArea: 'Pan India',
      specializations: ['Emergency Coordination', 'Multi-Service Response', 'National Coverage']
    },
    {
      name: 'Women Helpline',
      number: '1091',
      category: 'CIVIL_DEFENSE',
      description: '24/7 helpline for women in distress',
      available24x7: true,
      state: 'Punjab',
      district: null,
      city: null,
      location: 'Pan India',
      website: '',
      responseTime: 'Immediate response',
      coverageArea: 'Pan India',
      specializations: ['Women Safety', 'Domestic Violence', 'Emergency Support']
    },
    {
      name: 'Child Helpline',
      number: '1098',
      category: 'CIVIL_DEFENSE',
      description: '24/7 helpline for children in need',
      available24x7: true,
      state: 'Punjab',
      district: null,
      city: null,
      location: 'Pan India',
      website: '',
      responseTime: 'Immediate response',
      coverageArea: 'Pan India',
      specializations: ['Child Protection', 'Emergency Support', 'Child Welfare']
    },

    // Utility Services
    {
      name: 'Punjab State Power Corporation',
      number: '1912',
      category: 'UTILITY_SERVICES',
      description: 'Power outage and electrical emergency reporting',
      available24x7: true,
      state: 'Punjab',
      district: null,
      city: null,
      location: 'Punjab State',
      website: 'https://www.pseb.ac.in',
      responseTime: 'Within 2 hours',
      coverageArea: 'Punjab State',
      specializations: ['Power Restoration', 'Electrical Safety', 'Grid Management']
    },
    {
      name: 'Punjab Water Supply',
      number: '1916',
      category: 'UTILITY_SERVICES',
      description: 'Water supply emergency and quality issues',
      available24x7: true,
      state: 'Punjab',
      district: null,
      city: null,
      location: 'Punjab State',
      website: '',
      responseTime: 'Within 4 hours',
      coverageArea: 'Punjab State',
      specializations: ['Water Supply', 'Quality Control', 'Infrastructure Maintenance']
    },

    // Transport Services
    {
      name: 'Punjab Roadways Emergency',
      number: '0172-2700002',
      category: 'TRANSPORT',
      description: 'Punjab Roadways emergency and accident response',
      available24x7: true,
      state: 'Punjab',
      district: null,
      city: null,
      location: 'Punjab State',
      website: '',
      responseTime: 'Within 30 minutes',
      coverageArea: 'Punjab State',
      specializations: ['Road Safety', 'Accident Response', 'Transport Coordination']
    },

    // Volunteer Organizations
    {
      name: 'Punjab Red Cross Society',
      number: '0172-2700003',
      category: 'VOLUNTEER_ORGANIZATIONS',
      description: 'Punjab Red Cross emergency response and relief',
      available24x7: true,
      state: 'Punjab',
      district: null,
      city: null,
      location: 'Red Cross Bhawan, Chandigarh',
      website: 'https://www.indianredcross.org',
      responseTime: 'Within 1 hour',
      coverageArea: 'Punjab State',
      specializations: ['Disaster Relief', 'Blood Services', 'First Aid Training']
    }
  ];

  for (const contactData of contacts) {
    try {
      const contact = await prisma.emergencyContact.upsert({
        where: { 
          number: contactData.number 
        },
        update: {
          name: contactData.name,
          category: contactData.category,
          description: contactData.description,
          available24x7: contactData.available24x7,
          location: contactData.location,
          website: contactData.website,
          state: contactData.state,
          district: contactData.district,
          city: contactData.city,
          alternateNumbers: contactData.alternateNumbers ? JSON.stringify(contactData.alternateNumbers) : null,
          email: contactData.email || null,
          socialMedia: contactData.socialMedia ? JSON.stringify(contactData.socialMedia) : null,
          responseTime: contactData.responseTime,
          coverageArea: contactData.coverageArea,
          specializations: contactData.specializations ? JSON.stringify(contactData.specializations) : null
        },
        create: {
          name: contactData.name,
          number: contactData.number,
          category: contactData.category,
          description: contactData.description,
          available24x7: contactData.available24x7,
          location: contactData.location,
          website: contactData.website,
          state: contactData.state,
          district: contactData.district,
          city: contactData.city,
          alternateNumbers: contactData.alternateNumbers ? JSON.stringify(contactData.alternateNumbers) : null,
          email: contactData.email || null,
          socialMedia: contactData.socialMedia ? JSON.stringify(contactData.socialMedia) : null,
          responseTime: contactData.responseTime,
          coverageArea: contactData.coverageArea,
          specializations: contactData.specializations ? JSON.stringify(contactData.specializations) : null,
          isActive: true
        }
      });
      console.log(`✅ Created/Updated contact: ${contact.name} (${contact.number})`);
    } catch (error) {
      console.error(`❌ Error creating contact ${contactData.name}:`, error);
    }
  }

  console.log('📞 Punjab Emergency Contacts seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding contacts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
