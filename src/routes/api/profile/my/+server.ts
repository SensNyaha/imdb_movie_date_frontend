import { error, json, type RequestHandler } from '@sveltejs/kit';
import { SERVER } from '$env/static/private';
import catchHelper from '$lib/catchHelper';

export const GET: RequestHandler  = async ({cookies}) => {
	try {
		const res = await fetch(`${SERVER}/api/v1/users/my`, {
			headers: {"Authorization": `Bearer ${cookies.get("accessToken")}`}
		})
		console.log(res)
		const jsoned = await res.json();
		// message из http пакета видно только в jsoned.message

		if (!res.ok) {
			throw error(res.status, jsoned.message || res.statusText)
		}
		return json(jsoned)
	} catch (e) {
		return catchHelper(e, "Unable to fetch data from the server. May be server is dead:");
	}
}