import type { LayoutLoad } from './$types';
import { PUBLIC_SERVER_URL } from '$env/static/public';

export const load: LayoutLoad = ({data}) => {
	if (data.user && !data.user.avatar.startsWith(PUBLIC_SERVER_URL)) {
		data.user.avatar = `${PUBLIC_SERVER_URL}/static/${data.user.avatar}`;
	}
	return data
}