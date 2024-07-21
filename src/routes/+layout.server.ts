import type { LayoutServerLoad} from "./$types"

export const load: LayoutServerLoad = async ({cookies, fetch}) => {
	try {
		if (!cookies.get("accessToken")) return {user: null}
		const res = await fetch("/api/profile/my");

		const jsoned = await res.json();

		if (!res.ok) {
			cookies.delete("accessToken", {path: "/"});
			return {
				user: null,
				lastServerError: "AccessToken deleted cause couldn't get user's info",
			}
		}
		return {
			user: jsoned.data,
		}
	} catch (e) {
		console.error(e);
		return {
			user: null,
			lastServerError: "AccessToken deleted cause couldn't get user's info",
		}
	}
}
