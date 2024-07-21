// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			accessToken?: string;
		}
		interface PageData {
			user?: {
				avatar: string,
				email: string,
				_id: string,
				dates: [object],
				isSuperAdmin: boolean,
				country: null | string,
				accessToken: string | null,
				recoveryToken: string | null,
				emailVerified: boolean,
				fullname: string
			} | null,
			lastServerError?: null | string | undefined
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
