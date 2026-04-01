import { Database } from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema'; // Import all schema exports

async function main() {
	// The database path typically comes from environment variables or a configuration.
	// For a simple seed script, './sqlite.db' is a common development default.
	// You might need to adjust this path based on your Drizzle configuration or how
	// your main application connects to the database.
	const dbPath = './sqlite.db';

	let sqlite: Database | null = null; // Initialize as nullable
	try {
		sqlite = new Database(dbPath);
		const db = drizzle(sqlite, { schema });

		console.log(`Seeding database at ${dbPath}...`);

		// Optional: Clear existing data for idempotent seeding
		// console.log('Clearing existing inscriptions...');
		// await db.delete(schema.inscriptions);
		// console.log('Existing inscriptions cleared.');

		const inscriptionsToInsert = [
			{
				id: crypto.randomUUID(),
				name: 'Mangulam Inscription',
				scriptType: 'Brahmi',
				content: 'Kaniyan Nanda-Asiriyan...',
				translation: null
			},
			{
				id: crypto.randomUUID(),
				name: 'Pulankurichi Inscription',
				scriptType: 'Vatteluttu',
				content: 'Ko-Chendan-Kootran...',
				translation: null
			}
		];

		await db.insert(schema.inscriptions).values(inscriptionsToInsert);
		console.log(`Inserted ${inscriptionsToInsert.length} inscriptions.`);
		console.log('Seed completed successfully.');
	} catch (error) {
		console.error('Seed script failed:', error);
		process.exit(1);
	} finally {
		if (sqlite) {
			sqlite.close();
			console.log('Database connection closed.');
		}
	}
}

main();
