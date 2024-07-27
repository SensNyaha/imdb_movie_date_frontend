<script lang="ts">
	import type { PageData } from '../../../.svelte-kit/types/src/routes/update/$types';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	export let data:PageData;

	onMount(() => {
		invalidateAll();
	})
</script>

<h1>PROFILE</h1>
Username: {data.user.username}