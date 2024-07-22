import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import catchHelper from '$lib/catchHelper';

export const POST: RequestHandler = async ({request, fetch}) => {
	try {
		const body = await request.json();
		const res = await fetch(`${PUBLIC_SERVER_URL}/api/v1/users/register`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json"
			}
		});
		const jsoned = await res.json();

		if (jsoned.success) {
			throw redirect(301, `/login`);
		}
		throw error(res.status,  jsoned.message || res.statusText);
	} catch (e) {
		return catchHelper(e)
	}
}