<script lang="ts">
	import {  invalidateAll } from '$app/navigation';

	let email = "mwmakarov@bk.ru";
	let password = "Zoom290798";

	import {page} from "$app/stores";
	import { getContext, onMount } from 'svelte';
	import { error } from '@sveltejs/kit';
	import type { Writable } from 'svelte/store';
	import type { CustomError } from '$lib';

	const errorStore: Writable<null | string> = getContext("errorContext");

	// onMount(() => {
	// 	if ($page.url.searchParams.get("message") != null) {
	// 		alert($page.url.searchParams.get("message"))
	// 	}
	// })

	const loginHandler = async () => {
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				body: JSON.stringify({email, password}),
				headers: {
					"Content-Type": "application/json",
				}
			});
			if (res.ok || res.redirected) {
				await invalidateAll();
			} else {
				const jsoned = await res.json();
				throw error(res.status, jsoned.message || res.statusText);
			}
		} catch (e) {
			let customedError = e as CustomError;
			errorStore.set("Error while loging out: " + (customedError?.body?.message || customedError.message || ""));
			// setTimeout(() => errorStore.set(""), 2000)
		}
	}

</script>
<!---->
<form method="POST" action="?/login" on:submit|preventDefault={loginHandler}>
	<input type="text" bind:value={email} name="email" required>
	<input type="password" bind:value={password} name="password" required>
	<button>LOGIN</button>
</form>

