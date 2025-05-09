import { seedTimeAvailabilitySlots } from './seed-availability';

async function main() {
  try {
    // You would typically run other seeders first, like users, specialties, and doctorProfiles
    // before running the timeAvailabilitySlots seeder
    
    await seedTimeAvailabilitySlots();
    
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main();
