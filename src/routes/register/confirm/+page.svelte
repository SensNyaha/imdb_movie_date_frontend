<script lang="ts">
	import {page} from "$app/stores";
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	interface RegistrationConfirm {
		message: string;
	}

	const errorStore: Writable<null | string> = getContext("errorContext");
	const statusStore: Writable<null | string> = getContext("statusContext");

	let result: string | undefined = undefined;

//TODO: бросить здесь редирект на /login, но только после успешного возврата подтверждения и в statusStore записать значение возвращенного сообщения
	onMount(async () => {
		try {
			if ($page.url.searchParams.get("link") != null) {
				const res = await fetch($page.url.searchParams.get("link") as string);

				const jsoned:RegistrationConfirm = await res.json();

				if (res.ok) {
					statusStore.set(jsoned.message || "Registration confirmed successfully");
					throw redirect(307, "/login");
				} else {
					// errorStore.set(jsoned.message || res.statusText || "Registration confirmation failed")
					throw new Error("Server responded by falsy response: " + jsoned.message || res.statusText);
				}
			} else {
				// errorStore.set("Wrong confirmation link")
				throw new Error("Something happened while server response was parsing");
			}
		} catch (e) {
			if (e.location) goto(e.location);
			else {
				let customedError = e as Error;
				// errorStore.set("Registration confirmation failed: " + customedError.message || "");
				result = "Registration confirmation failed: " + customedError.message || ""
			}
		}
	})
</script>

<h1>{result || "FETCHING...."}</h1>