<script lang="ts">

		import type { PageServerData } from './$types';

		export let data: PageServerData;
		$: console.log(data.fetchedUser)
</script>

<h1>PROFILE</h1>

Username: {data?.fetchedUser?.username}