import { error, json, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import catchHelper from '$lib/catchHelper';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	if (user && user.accessToken) throw redirect(301, "/");
}

export const actions = {
	login: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		try {
			const res = await fetch(`/api/auth/login`, {
				method: "POST",
				body: JSON.stringify({ email, password }),
				headers: {
					"Content-Type": "application/json"
				}
			});
			const jsoned = await res.json();

			if (jsoned.success) {
				cookies.set("accessToken", jsoned?.data?.accessToken || "", {path: "/"});
				throw redirect(301, "/");
			}
			throw error(res.status,  jsoned.message || res.statusText);
		} catch (e) {
			return catchHelper(e);
		}
	},
	"reset-password": async ({ request, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		try {
			const res = await fetch(`/api/auth/reset-password`, {
				method: "POST",
				body: JSON.stringify({ email }),
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
};
