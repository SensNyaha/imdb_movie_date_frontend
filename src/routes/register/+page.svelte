<script lang="ts">

	import { goto, invalidateAll } from '$app/navigation';

	let email = "mihanmakarov@gmail.com";
	let password = "Zoom290798";
	let username = "sensnyaha22";

</script>
<form method="POST" action="?/register" on:submit|preventDefault={async () => {
	const res = await fetch("api/auth/register", {
		method: "POST",
		body: JSON.stringify({email, password, username}),
		headers: {
			"Content-Type": "application/json",
		}
	});
	if (res.ok) {
		await invalidateAll();
		goto(res.url);
	}
}}>
	<input type="text" bind:value={email} name="email" required>
	<input type="text" bind:value={username} name="username" required>
	<input type="password" bind:value={password} name="password" required>
	<button>LOGIN</button>
</form>

