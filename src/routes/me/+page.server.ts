import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({parent}) => {
	const data = await parent();
	if (!data?.user) throw redirect(307, "/login");
}