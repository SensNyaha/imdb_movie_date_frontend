import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const actions = {
	login: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

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
	}
};

export const load: PageServerLoad = async ({ parent }) => {
	if ((await parent())?.user?.accessToken) throw redirect(301, "/");
}