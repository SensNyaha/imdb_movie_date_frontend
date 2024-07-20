import { error, json, type RequestHandler } from '@sveltejs/kit';
import { SERVER } from '$env/static/private';

export const GET: RequestHandler  = async ({cookies}) => {
	const res = await fetch(`${SERVER}/api/v1/users/my`, {
		headers: {"Authorization": `Bearer ${cookies.get("accessToken")}`}
	})
	const jsoned = await res.json();

	if (!res.ok) {
		throw error(res.status, jsoned.message || res.statusText)
	}
	return json(jsoned)
}