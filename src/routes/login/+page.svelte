<script lang="ts">

	import {  invalidateAll } from '$app/navigation';

	let email = "mwmakarov@bk.ru";
	let password = "Zoom290798";

	import {page} from "$app/stores";
	import { onMount } from 'svelte';

	onMount(() => {
		if ($page.url.searchParams.get("message") != null) {
			alert($page.url.searchParams.get("message"))
		}
	})

</script>
<form method="POST" action="?/login" on:submit|preventDefault={async () => {
	const res = await fetch("api/auth/login", {
		method: "POST",
		body: JSON.stringify({email, password}),
		headers: {
			"Content-Type": "application/json",
		}
	});
	if (res.ok) {
		await invalidateAll();
	}
}}>
	<input type="text" bind:value={email} name="email" required>
	<input type="password" bind:value={password} name="password" required>
	<button>LOGIN</button>
</form>

