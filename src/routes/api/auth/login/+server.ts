import { error, json, type RequestHandler } from '@sveltejs/kit';
import { SERVER } from '$env/static/private';

export const POST: RequestHandler = async ({request, fetch, cookies}) => {
    const body = await request.json();
    const res = await fetch(`${SERVER}/api/v1/users/login`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    });
    const jsoned = await res.json();
    if (!jsoned.success) throw error(res.status,  jsoned.message || res.statusText);
    cookies.set("accessToken", jsoned.data.accessToken, {path:'/'})
    return json(jsoned);
}