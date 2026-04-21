import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

async function main() {
	const dbPath = process.env.DATABASE_URL || 'file:local.db';
	const authToken = process.env.DATABASE_AUTH_TOKEN;

	try {
		const client = createClient({
			url: dbPath,
			authToken: authToken || undefined
		});
		const db = drizzle(client, { schema });

		console.log(`Seeding database at ${dbPath}...`);

		const inscriptionsToInsert = [
			{
				id: crypto.randomUUID(),
				name: 'Mangulam Inscription',
				scriptType: 'Brahmi' as const,
				content: 'Kaniyan Nanda-Asiriyan...',
				translation: null
			},
			{
				id: crypto.randomUUID(),
				name: 'Pulankurichi Inscription',
				scriptType: 'Vatteluttu' as const,
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
	}
}

main();
