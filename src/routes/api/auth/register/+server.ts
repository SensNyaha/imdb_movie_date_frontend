import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';
import { SERVER } from '$env/static/private';
import catchHelper from '$lib/catchHelper';

export const POST: RequestHandler = async ({request, fetch}) => {
	try {
		const body = await request.json();
		const res = await fetch(`${SERVER}/api/v1/users/register`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json"
			}
		});
		const jsoned = await res.json();

		if (jsoned.success) {
			throw redirect(301, `/login?message=${jsoned?.message || ""}`);
		}
		throw error(res.status,  jsoned.message || res.statusText);
	} catch (e) {
		return catchHelper(e)
	}
}