<script lang="ts">
	import { getContext, onMount } from 'svelte';

	import {page} from "$app/stores"
	import type { Writable } from 'svelte/store';
	import { goto, invalidateAll } from '$app/navigation';
	import { error } from '@sveltejs/kit';
	import type { CustomError } from '$lib';

	let newPassword = "";

	let confirmedResetRequest = false;
	let textResult: null | string = null;

	const statusStore: Writable<null | string> = getContext("statusContext");
	const errorStore: Writable<null | string> = getContext("errorContext");


	onMount(async () => {
		try {
			const resetToken = $page.url.searchParams.get("token");
			const confirmationGetLink = $page.url.searchParams.get("confirm");

			if (!confirmationGetLink || !resetToken) throw new Error("Wrong link!")
			
			const response = await fetch(`/api/auth/reset-password-confirm`, {
				method: "POST",
				body: JSON.stringify({confirmationGetLink, resetToken}),
				headers: {
					"Content-Type": "application/json",
				}
			});
			const jsoned = await response.json();

			if (!response.ok) throw new Error("Server bad response: " + jsoned.message || response.statusText);

			statusStore.set(jsoned.message || "Password reseted successfully. Now input new password");
			confirmedResetRequest = true;
		} catch (e) {
			let customedError = e as Error;
			textResult = "Confirmation of reset password failed: " + customedError.message || ""
		}
	})

	const setNewPasswordHandler = async () => {
		try {
			const res = await fetch("api/auth/set-new-password", {
				method: "POST",
				body: JSON.stringify({password: newPassword}),
				headers: {
					"Content-Type": "application/json",
				}
			});
			if (res.ok || res.redirected) {
				await invalidateAll();
				statusStore.set("User changed password successfully. Now you can use your new password to login")
				await goto("/login");
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

<h1>reset-password</h1>
{#if confirmedResetRequest}
	<form action="?/set-new-password" method="POST" on:submit|preventDefault={setNewPasswordHandler}>
		<input type="password" placeholder="new password" bind:value={newPassword}>
		<button>SET NEW PASSWORD</button>
	</form>
{:else}
	<span>{textResult || "Confirmating..."}</span>
{/if}