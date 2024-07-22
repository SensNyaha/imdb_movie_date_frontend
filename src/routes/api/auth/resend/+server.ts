import { error, json, type RequestHandler } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import catchHelper from '$lib/catchHelper';

export const POST: RequestHandler = async ({ fetch, cookies}) => {
	try {
		const res = await fetch(`${PUBLIC_SERVER_URL}/api/v1/users/resend`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${cookies.get("accessToken")}`
			}
		});
		const jsoned = await res.json();
		if (!jsoned.success) throw error(res.status,  jsoned.message || res.statusText);

		return json(jsoned)
	} catch (e) {
		return catchHelper(e, "Error while trying to resend verification email: ");
	}
}