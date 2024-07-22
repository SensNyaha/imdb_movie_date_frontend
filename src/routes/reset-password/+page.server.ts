import { error, json, redirect } from '@sveltejs/kit';
import catchHelper from '$lib/catchHelper';

export const actions = {
	"set-new-password": async ({ request, fetch }) => {
		const formData = await request.formData();
		const password = formData.get('password');
		try {
			const res = await fetch(`/api/auth/set-new-password`, {
				method: "POST",
				body: JSON.stringify({ password }),
				headers: {
					"Content-Type": "application/json"
				}
			});
			const jsoned = await res.json();
			if (!jsoned.success) throw error(res.status,  jsoned.message || res.statusText);

			throw redirect(307, "/login")
		} catch (e) {
			return catchHelper(e, "Error while trying to send a reset password email message to you");
		}
	}
};