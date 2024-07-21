<script lang="ts">

	import { goto, invalidateAll } from '$app/navigation';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { error } from '@sveltejs/kit';

	let email = "mihanmakarov@gmail.com";
	let password = "Zoom290798";
	let username = "sensnyaha22";
	
	const errorStore: Writable<null | string> = getContext("errorContext");

</script>
<form method="POST" action="?/register" on:submit|preventDefault={async () => {
	try {
		const res = await fetch("api/auth/register", {
			method: "POST",
			body: JSON.stringify({email, password, username}),
			headers: {
				"Content-Type": "application/json",
			}
		});
		const jsoned = await res.json();
		if (res.ok) {
			await invalidateAll();
			goto(res.url);
		} else {
			throw error(res.status, jsoned.message || res.statusText);
		}
	}
	catch (e) {
		errorStore.set("Error while trying to register: " + (e?.body?.message || e.message || ""));
		setTimeout(() => errorStore.set(""), 2000)
	}
}}>
	<input type="text" bind:value={email} name="email" required>
	<input type="text" bind:value={username} name="username" required>
	<input type="password" bind:value={password} name="password" required>
	<button>LOGIN</button>
</form>

