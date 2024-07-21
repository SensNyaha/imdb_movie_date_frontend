import { error, redirect } from '@sveltejs/kit';

export default (e: any, message: string = "Something went wrong:") => {
	if (e?.body?.message) throw error(e.status, e.body.message);
	if (e?.location) throw redirect(e.status, e.location);
	throw error(500, `${message} ${e.message}`)
}