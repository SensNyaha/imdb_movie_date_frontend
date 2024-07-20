<script lang="ts">
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';

	import {page} from "$app/stores";

	export let data:LayoutData;
	onMount(() => {
		if (data?.user?.errorMessage) {
			alert(data.user.errorMessage);
		}
	})
</script>

{data?.user?.username || ""}
<a href="/" class:active={$page.url.pathname === "/"}>HOME</a>
<a href="/login" class:active={$page.url.pathname === "/login"}>LOGIN</a>
<a href="/register" class:active={$page.url.pathname === "/register"}>REGISTER</a>

{#if data?.user}
	<form method="POST" action="/api/auth/logout"  on:submit|preventDefault={async () => {
	const res = await fetch("/api/auth/logout", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${data.user.accessToken}`,
		}
	});

	if (res.ok) {
		await invalidateAll();
		await goto("/")
	}
}}>
		<button>LOGOUT</button>
	</form>
{/if}

<slot><!-- optional fallback --></slot>

<style lang="scss">
	a {
    color: blue;
    text-decoration: none;
		&.active {
			color: black;
      font-weight: 900;
		}
	}
</style>