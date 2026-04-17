import { turso } from '$lib/server/turso';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const result = await turso.execute({
		sql: 'SELECT * FROM inscriptions WHERE id = ?',
		args: [params.id]
	});

	if (result.rows.length === 0) {
		throw error(404, 'Inscription not found');
	}

	return {
		inscription: result.rows[0]
	};
};
