import { error, redirect, type ServerLoad } from '@sveltejs/kit';
import catchHelper from '$lib/catchHelper';

export const load:ServerLoad = async ({params, fetch, cookies}) => {
	try {
		if (!cookies.get("accessToken")) throw redirect(307, '/login')

		const response = await fetch(`/api/profile/info/${params.id}`);
		const jsoned = await response.json();

		if (!response.ok || !jsoned.success) {
			throw error(response.status, jsoned.message || response.statusText)
		}
		return {
			fetchedUser: jsoned.data || null
		}

	} catch (e) {
		return catchHelper(e, "Unable to fetch data about user: ")
	}
}
