<script lang="ts">
	import type { PageData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import { error } from '@sveltejs/kit';
	import type { CustomError } from '$lib';
	import type { Writable } from 'svelte/store';
	import { getContext, onMount } from 'svelte';
	export let data:PageData;

	$: username = data?.user?.username;
	$: fullname = data?.user?.fullname;
	$: country = data?.user?.country;

	const errorStore: Writable<null | string> = getContext("errorContext");
	const statusStore: Writable<null | string> = getContext("statusContext");

	let newUsername: string, newFullname: string, newCountry: string = country;

	interface updateBody {
		username: string | undefined;
		fullname: string | undefined;
		country: string | undefined;
	}

	onMount(() => {
		if (true) {
			inputAvatar.style.display = "none";
			inputTrigger.style.display = "block";
		}
	})

	let photoFiles: Blob[];
	let inputAvatar: HTMLInputElement;
	let inputTrigger: HTMLInputElement;

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
	const uploadNewAvatar = async () => {
		try {
			const formData = new FormData();
			formData.append("photo", photoFiles[0]);
			const response = await fetch("/api/profile/upload-photo", {
				method: "POST",
				body: formData,
			});
			const jsoned = await response.json();
			if (response.ok || response.redirected) {
				await invalidateAll();
				statusStore.set(`Succeeded by server: ${jsoned.message}`);
				photoFiles = [];
			} else {
				throw error(response.status, jsoned.message || response.statusText);
			}
		} catch (e) {
			let customedError = e as CustomError;
			errorStore.set("Error while uploading photo: " + (customedError?.body?.message || customedError.message || ""));
		}
	}
	const deleteAvatar = async () => {
		try {
			const response = await fetch("/api/profile/delete-photo", {
				method: "POST",
			});
			const jsoned = await response.json();
			if (response.ok || response.redirected) {
				await invalidateAll();
				statusStore.set(`Succeeded by server: ${jsoned.message}`);
				photoFiles = [];
			} else {
				throw error(response.status, jsoned.message || response.statusText);
			}
		} catch (e) {
			let customedError = e as CustomError;
			errorStore.set("Error while delete photo avatar: " + (customedError?.body?.message || customedError.message || ""));
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
<br><br><br><br><br><br>
CHANGE YOUR PHOTO IMAGE
<form action="?/upload-photo" method="POST" on:submit|preventDefault={uploadNewAvatar} enctype="multipart/form-data">
	<input name="photo" type="file" id="input-avatar" accept="image/*" required bind:files={photoFiles} bind:this={inputAvatar}/>
	<input type="button" value="Browse..." on:click={() => inputAvatar.click()} bind:this={inputTrigger} style:display="none"/>
	{#if photoFiles && photoFiles.length > 0}
		<img class="avatar-preview" src={URL.createObjectURL(photoFiles[0])} alt="uploaded avatar">
	{/if}
	<button>UPLOAD PHOTO</button>
</form>

<form action="?/delete-photo" method="POST" on:submit={deleteAvatar}>
	<button>DELETE MY CURRENT PHOTO</button>
</form>

<style lang="scss">
	.input-equals {
		border: 1px solid crimson;
		outline: 1px solid crimson;
	}
	.avatar-preview {
    max-width: 300px;
    max-height: 200px;
	}
</style>