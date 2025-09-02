import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Seeding Indian Geographic Regions...');

  // Create major geographic regions in India
  const regions = [
    {
      name: 'Himalayan Region',
      description: 'Northern mountainous region including Jammu & Kashmir, Himachal Pradesh, Uttarakhand, and parts of Sikkim and Arunachal Pradesh',
      states: ['Jammu & Kashmir', 'Himachal Pradesh', 'Uttarakhand', 'Sikkim', 'Arunachal Pradesh'],
      districts: ['Leh', 'Kargil', 'Shimla', 'Manali', 'Dehradun', 'Rishikesh', 'Gangtok', 'Itanagar'],
      hazards: ['Earthquake', 'Landslide', 'Avalanche', 'Flash Flood', 'Cold Wave', 'Heavy Snowfall'],
      climate: 'Alpine and sub-alpine with extreme temperature variations'
    },
    {
      name: 'Indo-Gangetic Plain',
      description: 'Fertile plains stretching from Punjab to West Bengal, including major river systems',
      states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'Jharkhand', 'West Bengal'],
      districts: ['Amritsar', 'Chandigarh', 'Lucknow', 'Varanasi', 'Patna', 'Kolkata'],
      hazards: ['Flood', 'Drought', 'Heat Wave', 'Cold Wave', 'Dust Storm', 'River Erosion'],
      climate: 'Tropical monsoon with hot summers and cold winters'
    },
    {
      name: 'Coastal Odisha & Andhra Pradesh',
      description: 'Eastern coastal region vulnerable to cyclones and storm surges',
      states: ['Odisha', 'Andhra Pradesh'],
      districts: ['Puri', 'Bhubaneswar', 'Visakhapatnam', 'Kakinada', 'Ganjam', 'Gajapati'],
      hazards: ['Cyclone', 'Storm Surge', 'Flood', 'Coastal Erosion', 'Heavy Rainfall', 'High Winds'],
      climate: 'Tropical monsoon with high humidity and rainfall'
    },
    {
      name: 'Western Coastal Region',
      description: 'Coastal areas of Maharashtra, Goa, Karnataka, and Kerala',
      states: ['Maharashtra', 'Goa', 'Karnataka', 'Kerala'],
      districts: ['Mumbai', 'Pune', 'Panaji', 'Mangalore', 'Kochi', 'Thiruvananthapuram'],
      hazards: ['Cyclone', 'Flood', 'Landslide', 'Coastal Erosion', 'Heavy Rainfall', 'High Tides'],
      climate: 'Tropical monsoon with moderate temperatures and high rainfall'
    },
    {
      name: 'North-Eastern States',
      description: 'Seven sister states with unique geographical and climatic conditions',
      states: ['Assam', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura'],
      districts: ['Guwahati', 'Shillong', 'Imphal', 'Aizawl', 'Kohima', 'Agartala'],
      hazards: ['Flood', 'Landslide', 'Earthquake', 'Heavy Rainfall', 'Flash Flood', 'River Erosion'],
      climate: 'Subtropical with high rainfall and humidity'
    },
    {
      name: 'Central India Plateau',
      description: 'Highland region including Madhya Pradesh, Chhattisgarh, and parts of Maharashtra',
      states: ['Madhya Pradesh', 'Chhattisgarh', 'Maharashtra'],
      districts: ['Bhopal', 'Indore', 'Raipur', 'Nagpur', 'Jabalpur', 'Gwalior'],
      hazards: ['Drought', 'Heat Wave', 'Flood', 'Forest Fire', 'Dust Storm', 'Water Scarcity'],
      climate: 'Tropical savanna with hot summers and moderate winters'
    },
    {
      name: 'Thar Desert Region',
      description: 'Arid region in Rajasthan with extreme temperature variations',
      states: ['Rajasthan'],
      districts: ['Jaisalmer', 'Bikaner', 'Jodhpur', 'Barmer', 'Churu', 'Nagaur'],
      hazards: ['Drought', 'Heat Wave', 'Dust Storm', 'Water Scarcity', 'Desertification', 'Extreme Temperatures'],
      climate: 'Hot desert with extreme temperature variations'
    },
    {
      name: 'Deccan Plateau',
      description: 'Southern plateau region including Karnataka, Telangana, and parts of Tamil Nadu',
      states: ['Karnataka', 'Telangana', 'Tamil Nadu', 'Andhra Pradesh'],
      districts: ['Bangalore', 'Hyderabad', 'Chennai', 'Vijayawada', 'Mysore', 'Warangal'],
      hazards: ['Drought', 'Heat Wave', 'Flood', 'Landslide', 'Water Scarcity', 'Forest Fire'],
      climate: 'Tropical savanna with distinct wet and dry seasons'
    },
    {
      name: 'Island Territories',
      description: 'Andaman & Nicobar Islands and Lakshadweep with unique marine ecosystems',
      states: ['Andaman & Nicobar Islands', 'Lakshadweep'],
      districts: ['Port Blair', 'Kavaratti', 'Agatti', 'Minicoy', 'Car Nicobar', 'Havelock'],
      hazards: ['Tsunami', 'Cyclone', 'Storm Surge', 'Coastal Erosion', 'Earthquake', 'High Winds'],
      climate: 'Tropical maritime with high humidity and moderate temperatures'
    },
    {
      name: 'Himalayan Foothills',
      description: 'Transition zone between Himalayas and plains including parts of Uttar Pradesh and Bihar',
      states: ['Uttar Pradesh', 'Bihar', 'West Bengal'],
      districts: ['Saharanpur', 'Bareilly', 'Moradabad', 'Muzaffarpur', 'Darbhanga', 'Siliguri'],
      hazards: ['Flood', 'Landslide', 'Heavy Rainfall', 'Flash Flood', 'River Erosion', 'Mudslide'],
      climate: 'Subtropical with moderate temperatures and seasonal rainfall'
    }
  ];

  for (const regionData of regions) {
    try {
      const region = await prisma.geographicRegion.upsert({
        where: { name: regionData.name },
        update: {
          description: regionData.description,
          states: JSON.stringify(regionData.states),
          districts: JSON.stringify(regionData.districts),
          hazards: JSON.stringify(regionData.hazards),
          climate: regionData.climate
        },
        create: {
          name: regionData.name,
          description: regionData.description,
          states: JSON.stringify(regionData.states),
          districts: JSON.stringify(regionData.districts),
          hazards: JSON.stringify(regionData.hazards),
          climate: regionData.climate,
          isActive: true
        }
      });
      console.log(`✅ Created/Updated region: ${region.name}`);
    } catch (error) {
      console.error(`❌ Error creating region ${regionData.name}:`, error);
    }
  }

  console.log('🌍 Indian Geographic Regions seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding regions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
