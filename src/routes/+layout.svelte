<script lang="ts">
	import type {CustomError} from '$lib';

	import {page} from "$app/stores";
	export let data:LayoutData;

	import type { LayoutData } from './$types';
	import { invalidateAll } from '$app/navigation';

	import { onMount, setContext } from 'svelte';
	import { type Writable, writable } from 'svelte/store';
	import { error } from '@sveltejs/kit';
	const errorStore = writable(data.lastServerError || "");
	setContext<Writable<null | string> | null>("errorContext", errorStore);
	const statusStore = writable("");
	setContext<Writable<null | string> | null>("statusContext", statusStore);


	onMount(() => {
		if (data.lastServerError && data.lastServerError === $errorStore) {
			setTimeout(() => errorStore.set(""), 2000)
		}
	})

	$: if ($errorStore) {
		setTimeout(() => errorStore.set(""), 2000)
	}

	$: if ($statusStore) {
		setTimeout(() => statusStore.set(""), 2000)
	}

	import {fade} from 'svelte/transition';

	async function logoutHandler () {
		try {
			const res = await fetch("/api/auth/logout", {
				method: "POST"
			});
			if (res.ok || res.redirected) {
				await invalidateAll();
			} else {
				const jsoned = await res.json();
				throw error(res.status, jsoned.message || res.statusText);
			}
		} catch (e) {
			let customedError = e as CustomError;
			errorStore.set("Error while logging out: " + (customedError?.body?.message || customedError.message || ""));
		}
	}
	async function resendVerificationEmail () {
		try {
			const res = await fetch("/api/auth/resend", {
				method: "POST"
			});
			const jsoned = await res.json();
			if (res.ok) {
				$statusStore = jsoned.message;
			} else {
				throw error(res.status, jsoned.message || res.statusText);
			}
		} catch (e) {
			let customedError = e as CustomError;
			errorStore.set("Error while trying to resend email verification: " + (customedError?.body?.message || customedError.message || ""));
		}
	}
</script>

{#if data.user}
	<div>
		{data.user.username || ""}
		<img class="avatar" src={data.user.avatar} alt="">
		{#if !data.user.emailVerified}
			<form method="POST" action="/api/auth/resend" on:submit|preventDefault={resendVerificationEmail}>
				<button>Resend Verification Email</button>
			</form>
		{/if}
	</div>
{/if}
{#if $errorStore}
	<div transition:fade>
		{$errorStore}
	</div>
{/if}
{#if $statusStore}
	<div transition:fade>
		{$statusStore}
	</div>
{/if}
<a href="/" class:active={$page.url.pathname === "/"}>HOME</a>
{#if !data.user}
	<a href="/login" class:active={$page.url.pathname === "/login"}>LOGIN</a>
	<a href="/register" class:active={$page.url.pathname === "/register"}>REGISTER</a>
{:else}
	<a href="/me" class:active={$page.url.pathname === "/me"}>ME</a>
	<a href="/update" class:active={$page.url.pathname === "/update"}>UPDATE</a>
{/if}

{#if data.user}
	<form method="POST" action="/api/auth/logout" on:submit|preventDefault={logoutHandler}>
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
	.avatar {
    width: 30px;
	}
</style>