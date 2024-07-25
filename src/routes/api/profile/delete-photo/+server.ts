import { error, json, type RequestHandler } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import catchHelper from '$lib/catchHelper';

export const POST: RequestHandler  = async ({cookies}) => {
	try {
		const res = await fetch(`${PUBLIC_SERVER_URL}/api/v1/users/delete-photo`, {
			headers: {"Authorization": `Bearer ${cookies.get("accessToken")}`},
			method: "DELETE"
		})
		const jsoned = await res.json();
		// message из http пакета видно только в jsoned.message

		if (!res.ok) {
			throw error(res.status, jsoned.message || res.statusText)
		}
		return json(jsoned)
	} catch (e) {
		return catchHelper(e, "Browser could not delete your avatar from server filesystem: ");
	}
}