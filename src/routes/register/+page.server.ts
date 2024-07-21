import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import catchHelper from '$lib/catchHelper';

export const actions = {
	register: async ({ request, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const username = formData.get('username');

		try {
			const res = await fetch(`/api/auth/register`, {
				method: "POST",
				body: JSON.stringify({ email, password, username }),
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (!res.ok && res.status >= 300 && res.status < 400 ) throw redirect(res.status, res?.headers?.get("location") || "/");
			const jsoned = await res.json();

			if (jsoned.success) {
				throw redirect(301, `/login`);
			}
			throw error(res.status,  jsoned.message || res.statusText);
		}
		catch (e) {
			return catchHelper(e);
		}
	}
};

export const load: PageServerLoad = async ({ parent }) => {
	if ((await parent())?.user?.accessToken) throw redirect(301, "/");
}