<script lang="ts">

	import { goto, invalidateAll } from '$app/navigation';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { error } from '@sveltejs/kit';
	import type { CustomError } from '$lib';

	let email = "mihanmakarov@gmail.com";
	let password = "Zoom290798";
	let username = "sensnyaha22";
	
	const errorStore: Writable<null | string> = getContext("errorContext");
	const statusStore: Writable<null | string> = getContext("statusContext");

	async function registerHandler() {
		try {
			const res = await fetch("api/auth/register", {
				method: "POST",
				body: JSON.stringify({email, password, username}),
				headers: {
					"Content-Type": "application/json",
				}
			});
			if (res.ok || res.redirected) {
				await invalidateAll();
				statusStore.set("User registered successfully. Confirm your email address in your email inbox")
				goto("/login");
			} else {
				const jsoned = await res.json();
				throw error(res.status, jsoned.message || res.statusText);
			}
		}
		catch (e) {
			let customedError = e as CustomError;
			errorStore.set("Error while trying to register: " + (customedError?.body?.message || customedError.message || ""));
		}
	}
</script>
<form method="POST" action="?/register" on:submit|preventDefault={registerHandler}>
	<input type="text" bind:value={email} name="email" required>
	<input type="text" bind:value={username} name="username" required>
	<input type="password" bind:value={password} name="password" required>
	<button>REGISTER</button>
</form>

