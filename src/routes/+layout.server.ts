import type { LayoutServerLoad} from "./$types"

export const load: LayoutServerLoad = async ({cookies, fetch}) => {
	if (!cookies.get("accessToken")) return {user: null}
	const res = await fetch("/api/profile/my");
	if (!res.ok) {
		cookies.delete("accessToken", {path: "/"});
		return {
			user: {
				errorMessage: (await res.json()).message
			}
		}
	} else {
		const jsoned = await res.json();

		return {
			user: jsoned.data,
		}
	}
}
