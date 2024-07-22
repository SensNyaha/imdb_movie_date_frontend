import { json, type RequestHandler } from '@sveltejs/kit';
import catchHelper from '$lib/catchHelper';

export const POST: RequestHandler = async ({request, cookies}) => {
	const { confirmationGetLink, resetToken } = await request.json();
	try {
		const res = await fetch(`${confirmationGetLink}${resetToken}`);

		const jsoned = await res.json();
		if (!res.ok || !jsoned.success) throw new Error("Server bad response: " + jsoned.message || res.statusText);

		cookies.set("resetToken", jsoned.data.recoveryToken, {path: "/"})
		return json(jsoned)
	} catch (e) {
		return catchHelper(e, "Confirmation of reset password failed: ");
	}
}