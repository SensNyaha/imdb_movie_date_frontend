import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import catchHelper from '$lib/catchHelper';

export const POST: RequestHandler = async ({ fetch, cookies}) => {
	try {
		const res = await fetch(`${PUBLIC_SERVER_URL}/api/v1/users/logout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${cookies.get("accessToken")}`
			}
		});
		const jsoned = await res.json();
		if (!jsoned.success) throw error(res.status,  jsoned.message || res.statusText);

		cookies.delete("accessToken", {path: "/"});
		throw redirect(303, "/")
	} catch (e) {
		return catchHelper(e, "Error while trying to logout: ");
	}
}