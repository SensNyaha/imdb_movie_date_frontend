<script lang="ts">
	import {  invalidateAll } from '$app/navigation';

	let email = "";
	let password = "";

	import { getContext } from 'svelte';
	import { error } from '@sveltejs/kit';
	import type { Writable } from 'svelte/store';
	import type { CustomError } from '$lib';
	import catchHelper from '$lib/catchHelper';

	const errorStore: Writable<null | string> = getContext("errorContext");
	const statusStore: Writable<null | string> = getContext("statusContext");

	let resetUserPasswordForm: boolean = false;

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
			errorStore.set("Error while logging out: " + (customedError?.body?.message || customedError.message || ""));
		}
	}
	const resetPasswordHandler = async () => {
		try {
			const res = await fetch(`/api/auth/reset-password`, {
				method: "POST",
				body: JSON.stringify({ email }),
				headers: {
					"Content-Type": "application/json"
				}
			});
			const jsoned = await res.json();

			if (res.ok || res.redirected) {
				$statusStore = jsoned.message;
			} else {
				throw error(res.status, jsoned.message || res.statusText);
			}
		} catch (e) {
			let customedError = e as CustomError;
			errorStore.set("Error while trying to send a reset password email message to you: " + (customedError?.body?.message || customedError.message || ""));
		}
	}
</script>
{#if !resetUserPasswordForm}
	<form method="POST" action="?/login" on:submit|preventDefault={loginHandler}>
		<input type="text" bind:value={email} name="email" required>
		<input type="password" bind:value={password} name="password" required>
		<button>LOGIN</button>
	</form>
	<button on:click={() => resetUserPasswordForm = true}>I FORGOT MY PASSWORD</button>
{:else}
	<form method="POST" action="?/reset-password" on:submit|preventDefault={resetPasswordHandler}>
		<input type="text" bind:value={email} name="email" required>
		<button>SEND EMAIL WITH RESET LINK</button>
	</form>
	<button on:click={() => resetUserPasswordForm = false}>I REMEMBER MY PASSWORD</button>
{/if}



