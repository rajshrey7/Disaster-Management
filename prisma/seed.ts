import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Learning Modules
  const earthquakeModule = await prisma.learningModule.create({
    data: {
      id: 'earthquake',
      title: 'Earthquake Safety',
      description: 'Learn essential earthquake preparedness and response',
      difficulty: 'BEGINNER',
      duration: 45,
      category: 'EARTHQUAKE',
      lessons: {
        create: [
          {
            title: 'Understanding Earthquakes',
            description: 'Learn about earthquake causes and effects',
            duration: 8,
            order: 1,
          },
          {
            title: 'Before an Earthquake',
            description: 'Preparation and safety measures',
            duration: 10,
            order: 2,
          },
          {
            title: 'During an Earthquake',
            description: 'Immediate actions to take during shaking',
            duration: 12,
            order: 3,
          },
          {
            title: 'After an Earthquake',
            description: 'Post-earthquake safety and recovery',
            duration: 10,
            order: 4,
          },
          {
            title: 'Practice Scenarios',
            description: 'Interactive earthquake scenarios',
            duration: 5,
            order: 5,
          },
        ],
      },
    },
  })

  const fireModule = await prisma.learningModule.create({
    data: {
      id: 'fire',
      title: 'Fire Safety',
      description: 'Fire prevention and emergency evacuation procedures',
      difficulty: 'BEGINNER',
      duration: 50,
      category: 'FIRE',
      lessons: {
        create: [
          {
            title: 'Fire Basics',
            description: 'Understanding fire behavior and types',
            duration: 8,
            order: 1,
          },
          {
            title: 'Fire Prevention',
            description: 'Preventing fires in educational settings',
            duration: 10,
            order: 2,
          },
          {
            title: 'Evacuation Procedures',
            description: 'Safe evacuation routes and procedures',
            duration: 15,
            order: 3,
          },
          {
            title: 'Fire Extinguishers',
            description: 'Using fire extinguishers correctly',
            duration: 12,
            order: 4,
          },
          {
            title: 'Emergency Response',
            description: 'Coordinating emergency response',
            duration: 5,
            order: 5,
          },
        ],
      },
    },
  })

  const floodModule = await prisma.learningModule.create({
    data: {
      id: 'flood',
      title: 'Flood Safety',
      description: 'Understanding flood risks and safety measures',
      difficulty: 'INTERMEDIATE',
      duration: 60,
      category: 'FLOOD',
      lessons: {
        create: [
          {
            title: 'Types of Floods',
            description: 'Different types of flooding and their causes',
            duration: 10,
            order: 1,
          },
          {
            title: 'Flood Warning Systems',
            description: 'Understanding flood warnings and alerts',
            duration: 8,
            order: 2,
          },
          {
            title: 'Preparation Before Floods',
            description: 'Getting ready for potential flooding',
            duration: 12,
            order: 3,
          },
          {
            title: 'During a Flood',
            description: 'Safety measures during flooding',
            duration: 15,
            order: 4,
          },
          {
            title: 'After Flood Safety',
            description: 'Post-flood recovery and safety',
            duration: 10,
            order: 5,
          },
          {
            title: 'Flood Recovery',
            description: 'Recovery and rebuilding after floods',
            duration: 5,
            order: 6,
          },
        ],
      },
    },
  })

  // Create Virtual Drills
  const earthquakeDrill = await prisma.virtualDrill.create({
    data: {
      id: 'earthquake',
      title: 'Earthquake Simulation',
      description: 'Practice drop, cover, and hold procedures during an earthquake',
      type: 'EARTHQUAKE',
      difficulty: 'BEGINNER',
      duration: 15,
      scenario: JSON.stringify({
        setting: 'Classroom',
        scenario: 'Earthquake drill during class hours',
        objectives: ['Practice drop, cover, hold', 'Evacuation procedures']
      }),
      steps: {
        create: [
          {
            title: 'Initial Tremor Detected',
            description: 'You feel the ground shaking. What\'s your first action?',
            choices: JSON.stringify([
              { text: 'Drop to the ground immediately', correct: true },
              { text: 'Run outside', correct: false },
              { text: 'Call for help', correct: false },
              { text: 'Stand in doorway', correct: false }
            ]),
            correctChoice: 0,
            points: 10,
            order: 1,
          },
          {
            title: 'Take Cover',
            description: 'You\'ve dropped to the ground. Where should you take cover?',
            choices: JSON.stringify([
              { text: 'Under a sturdy table or desk', correct: true },
              { text: 'Next to a window', correct: false },
              { text: 'Under a bed', correct: false },
              { text: 'In the bathroom', correct: false }
            ]),
            correctChoice: 0,
            points: 10,
            order: 2,
          },
        ],
      },
    },
  })

  const fireDrill = await prisma.virtualDrill.create({
    data: {
      id: 'fire',
      title: 'Fire Evacuation Drill',
      description: 'Learn proper evacuation routes and procedures during a fire',
      type: 'FIRE_EVACUATION',
      difficulty: 'BEGINNER',
      duration: 20,
      scenario: JSON.stringify({
        setting: 'School Building',
        scenario: 'Fire alarm activation during school hours',
        objectives: ['Safe evacuation', 'Assembly point procedures']
      }),
      steps: {
        create: [
          {
            title: 'Fire Alarm Sounds',
            description: 'You hear the fire alarm. What\'s your first action?',
            choices: JSON.stringify([
              { text: 'Evacuate immediately via nearest exit', correct: true },
              { text: 'Collect your belongings', correct: false },
              { text: 'Call the fire department', correct: false },
              { text: 'Wait for others', correct: false }
            ]),
            correctChoice: 0,
            points: 10,
            order: 1,
          },
        ],
      },
    },
  })

  // Create Emergency Contacts
  const contacts = [
    {
      name: 'National Emergency',
      number: '112',
      category: 'NATIONAL',
      description: 'All-in-one emergency number for police, fire, and ambulance',
      available24x7: true,
      location: 'Pan India',
      website: 'https://www.112.gov.in',
    },
    {
      name: 'Police',
      number: '100',
      category: 'POLICE',
      description: 'For police assistance and emergency reporting',
      available24x7: true,
      location: 'Pan India',
      website: '',
    },
    {
      name: 'Fire Department',
      number: '101',
      category: 'FIRE',
      description: 'For fire emergencies and rescue operations',
      available24x7: true,
      location: 'Pan India',
      website: '',
    },
    {
      name: 'Ambulance',
      number: '108',
      category: 'MEDICAL',
      description: 'Emergency medical services and ambulance',
      available24x7: true,
      location: 'Pan India',
      website: 'https://www.108ambulance.in',
    },
    {
      name: 'Disaster Management',
      number: '011-26701700',
      category: 'DISASTER',
      description: 'National Disaster Management Authority',
      available24x7: true,
      location: 'Delhi',
      website: 'https://www.ndma.gov.in',
    },
    {
      name: 'Women Helpline',
      number: '1091',
      category: 'SPECIAL',
      description: '24/7 helpline for women in distress',
      available24x7: true,
      location: 'Pan India',
      website: '',
    },
  ]

  for (const contact of contacts) {
    await prisma.emergencyContact.create({
      data: contact,
    })
  }

  // Create Sample Alerts
  const alerts = [
    {
      title: 'Heavy Rainfall Warning',
      description: 'Heavy to very heavy rainfall expected over the next 48 hours. Possible waterlogging in low-lying areas.',
      type: 'WEATHER',
      severity: 'HIGH',
      region: 'mumbai',
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
      actions: JSON.stringify([
        'Avoid unnecessary travel',
        'Stay indoors during heavy rain',
        'Keep emergency contacts ready',
        'Move to higher ground if in low-lying areas'
      ]),
      source: 'India Meteorological Department',
      contact: '022-26793222',
    },
    {
      title: 'Thunderstorm Alert',
      description: 'Thunderstorms with lightning and strong winds expected this evening. Take necessary precautions.',
      type: 'WEATHER',
      severity: 'MEDIUM',
      region: 'delhi',
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      actions: JSON.stringify([
        'Unplug electrical appliances',
        'Avoid open areas',
        'Stay away from tall structures',
        'Keep vehicles parked safely'
      ]),
      source: 'Regional Meteorological Centre',
      contact: '011-26793222',
    },
  ]

  for (const alert of alerts) {
    await prisma.alert.create({
      data: alert,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📚 Created ${await prisma.learningModule.count()} learning modules`)
  console.log(`🎯 Created ${await prisma.virtualDrill.count()} virtual drills`)
  console.log(`📞 Created ${await prisma.emergencyContact.count()} emergency contacts`)
  console.log(`🚨 Created ${await prisma.alert.count()} alerts`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })