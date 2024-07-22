import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import catchHelper from '$lib/catchHelper';

export const POST: RequestHandler = async ({request, fetch, cookies}) => {
	const body = await request.json();
	try {
		const resetToken = cookies.get('resetToken');
		if (!resetToken) throw new Error("No ANY Reset Token in cookies storage");

		const res = await fetch(`${PUBLIC_SERVER_URL}/api/v1/users/reset-password/set`, {
			method: "POST",
			body: JSON.stringify({...body, resetToken}),
			headers: {
				"Content-Type": "application/json"
			}
		});
		const jsoned = await res.json();
		if (!jsoned.success) throw error(res.status,  jsoned.message || res.statusText);

		cookies.delete("resetToken", {path: "/"})
		throw redirect(307, "/login");
	} catch (e) {
		return catchHelper(e, "Error while trying to send a reset password email message to you");
	}
}