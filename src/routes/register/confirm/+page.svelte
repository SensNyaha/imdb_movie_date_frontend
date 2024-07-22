<script lang="ts">
	import {page} from "$app/stores";
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { redirect } from '@sveltejs/kit';
	import { goto, invalidateAll } from '$app/navigation';

	interface RegistrationConfirm {
		message: string;
	}

	const statusStore: Writable<null | string> = getContext("statusContext");

	let result: string | undefined = undefined;

	onMount(async () => {
		try {
			if ($page.url.searchParams.get("link") != null) {
				const res = await fetch($page.url.searchParams.get("link") as string);

				const jsoned:RegistrationConfirm = await res.json();

				if (res.ok) {
					statusStore.set(jsoned.message || "Registration confirmed successfully");
					await invalidateAll();
					throw redirect(307, "/login");
				} else {
					throw new Error("Server responded by falsy response: " + jsoned.message || res.statusText);
				}
			} else {
				throw new Error("Something happened while server response was parsing");
			}
		} catch (e) {
			const customedError = e as {location: string};
			if (customedError.location) goto(customedError.location);
			else {
				let customedError = e as Error;
				result = "Registration confirmation failed: " + customedError.message || ""
			}
		}
	})
</script>

<h1>{result || "FETCHING...."}</h1>