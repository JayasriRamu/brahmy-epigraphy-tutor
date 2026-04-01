import { db } from '$lib/server/db/client';
import { inscriptions } from '$lib/server/db/schema';

export async function load() {
	const allInscriptions = await db.select().from(inscriptions);

	return {
		inscriptions: allInscriptions
	};
}
