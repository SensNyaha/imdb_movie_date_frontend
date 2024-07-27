import { error } from '@sveltejs/kit';
import catchHelper from '$lib/catchHelper';
import { redirect, type ServerLoad } from '@sveltejs/kit';


interface updateBody {
	username?: string | undefined;
	fullname?: string | undefined;
	country?: string | undefined;
}

export const actions = {
	update: async ({ request, fetch }) => {
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
	},
	"upload-photo": async ({ request, fetch }) => {
		const formData = await request.formData();

		try {
			const res = await fetch(`/api/profile/upload-photo`, {
				method: "POST",
				body: formData,
			});
			const jsoned = await res.json();

			if (jsoned.success) {
				return jsoned
			}
			throw error(res.status,  jsoned.message || res.statusText);
		} catch (e) {
			return catchHelper(e);
		}
	},
	"delete-photo": async ({ fetch }) => {
		try {
			const res = await fetch(`/api/profile/delete-photo`, {
				method: "POST",
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

export const load: ServerLoad = async ({parent}) => {
	const data = await parent();
	if (!data?.user) throw redirect(307, "/login");
}