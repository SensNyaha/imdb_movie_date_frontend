<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { error } from '@sveltejs/kit';
	import type { CustomError } from '$lib';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	export let data:PageData;

	$: username = data.user.username;
	$: fullname = data.user.fullname;
	$: country = data.user.country;

	const errorStore: Writable<null | string> = getContext("errorContext");
	const statusStore: Writable<null | string> = getContext("statusContext");

	let newUsername: string, newFullname: string, newCountry: string = country;

	interface updateBody {
		username: string | undefined;
		fullname: string | undefined;
		country: string | undefined;
	}


	async function updateHandler () {
		const body: updateBody = {
			username: undefined,
			fullname: undefined,
			country: undefined
		};
		if (newUsername && newUsername !== username) body.username = newUsername;
		if (newFullname && newFullname !== fullname) body.fullname = newFullname;
		if (newCountry && newCountry !== country) body.country = newCountry;

		if (Object.values(body).every(i => i === undefined)) return errorStore.set("You have not provided any new info!")

		try {
			const res = await fetch("/api/profile/my", {
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				}
			});
			const jsoned = await res.json();

			if (res.ok || res.redirected) {
				await invalidateAll();
				statusStore.set(`Succeeded by server: ${jsoned.message}`);
				newUsername = newFullname = "";
			} else {
				throw error(res.status, jsoned.message || res.statusText);
			}
		} catch (e) {
			let customedError = e as CustomError;
			errorStore.set("Error while updating info: " + (customedError?.body?.message || customedError.message || ""));
		}
	}
</script>
<br>
<br>

<form action="?/update" method="POST" on:submit|preventDefault={updateHandler}>
	<label>
		Username
		<input type="text" name="username" class:input-equals={username === newUsername} placeholder={username} bind:value={newUsername}/>
	</label>
	<br>
	<label>
		Full Name
		<input type="text" name="fullname" class:input-equals={fullname === newFullname} placeholder={fullname} bind:value={newFullname}/>
	</label>
	<br>
	<label>
		Country
		<select name="country" bind:value={newCountry}>
			<option value="RU">RU</option>
			<option value="KZ">KZ</option>
			<option value="BL">BL</option>
			<option value="CH">CH</option>
			<option value="UZ">UZ</option>
		</select>
	</label>
	<br>
	<button>UPDATE</button>
</form>

<style lang="scss">
	.input-equals {
		border: 1px solid crimson;
		outline: 1px solid crimson;
	}
</style>