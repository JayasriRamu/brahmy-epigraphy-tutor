import { turso } from '$lib/server/turso';

export async function load() {
	const result = await turso.execute('SELECT * FROM inscriptions');

	return {
		inscriptions: result.rows
	};
}
