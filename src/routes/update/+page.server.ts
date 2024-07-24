import { error, json, redirect } from '@sveltejs/kit';
import catchHelper from '$lib/catchHelper';

interface updateBody {
	username?: string | undefined;
	fullname?: string | undefined;
	country?: string | undefined;
}

export const actions = {
	update: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const fullname = formData.get('fullname');
		const country = formData.get('country');

		const body:updateBody = {};

		if (username) body.username = username as string;
		if (fullname) body.fullname = fullname as string;
		if (country) body.country = country as string;


		try {
			const res = await fetch(`/api/profile/my`, {
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json"
				}
			});
			const jsoned = await res.json();

			if (jsoned.success) {
				return jsoned
			}
			throw error(res.status,  jsoned.message || res.statusText);
		} catch (e) {
			return catchHelper(e);
		}
	}
};
