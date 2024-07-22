import { error, json, type RequestHandler } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import catchHelper from '$lib/catchHelper';

export const POST: RequestHandler = async ({request, fetch}) => {
	const body = await request.json();
	try {
		const res = await fetch(`${PUBLIC_SERVER_URL}/api/v1/users/reset-password/email`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json"
			}
		});
		const jsoned = await res.json();
		if (!jsoned.success) throw error(res.status,  jsoned.message || res.statusText);

		return json(jsoned)
	} catch (e) {
		return catchHelper(e, "Error while trying to send a reset password email message to you");
	}
}

