<script lang="ts">
	import type { LayoutData } from './$types';
	import { invalidateAll } from '$app/navigation';

	import {page} from "$app/stores";

	import {setContext} from 'svelte';
	import { type Writable, writable } from 'svelte/store';
	import { error } from '@sveltejs/kit';

	const errorStore = writable("");

	setContext<Writable<null | string> | null>("errorContext", errorStore);

	export let data:LayoutData;
</script>

{data?.user?.username || ""}
{#if errorStore}
	{$errorStore}
{/if}
<a href="/" class:active={$page.url.pathname === "/"}>HOME</a>
<a href="/login" class:active={$page.url.pathname === "/login"}>LOGIN</a>
<a href="/register" class:active={$page.url.pathname === "/register"}>REGISTER</a>

{#if data?.user}
	<form method="POST" action="/api/auth/logout"  on:submit|preventDefault={async () => {
	try {
		const res = await fetch("/api/auth/logout", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${data.user.accessToken}`,
			}
		});
		const jsoned = await res.json();
		if (res.ok) {
			await invalidateAll();
		} else {
			throw error(res.status, jsoned.message || res.statusText);
		}
	} catch (e) {
		errorStore.set("Error while loging out: " + (e?.body?.message || e.message || ""));
		setTimeout(() => errorStore.set(""), 2000)
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