import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { SERVER } from '$env/static/private';

export const POST: RequestHandler = async ({ fetch, cookies}) => {
	const res = await fetch(`${SERVER}/api/v1/users/logout`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${cookies.get("accessToken")}`
		}
	});
	const jsoned = await res.json();
	if (!jsoned.success) throw error(res.status,  jsoned.message || res.statusText);
	cookies.delete("accessToken", {path: "/"});
	throw redirect(303, "/")
}