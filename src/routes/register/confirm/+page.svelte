<script lang="ts">
	import {page} from "$app/stores";
	import { onMount } from 'svelte';

	interface RegistrationConfirm {
		message: string;
	}

	let result: RegistrationConfirm;

	onMount(async () => {
		if ($page.url.searchParams.get("link") != null) {
			const res = await fetch($page.url.searchParams.get("link"));

			const jsoned = await res.json();

				result = jsoned;
		}
	})
</script>

<h1>{result && result.message}</h1>