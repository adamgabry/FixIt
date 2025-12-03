import { seedDatabase } from '../src/db/seed';

seedDatabase()
	.then(() => {
		console.log('✅ Database seeded successfully!');
		process.exit(0);
	})
	.catch((error) => {
		console.error('❌ Error seeding database:', error);
		process.exit(1);
	});

