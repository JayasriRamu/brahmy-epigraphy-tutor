import { turso } from '$lib/server/turso';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (params.id) {
		const result = await turso.execute({
			sql: 'SELECT * FROM inscriptions WHERE id = ?',
			args: [params.id]
		});

		if (result.rows.length > 0) {
			return {
				inscription: result.rows[0]
			};
		}
	}
	return {};
};
