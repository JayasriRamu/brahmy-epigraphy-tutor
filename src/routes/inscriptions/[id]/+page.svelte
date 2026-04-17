<script lang="ts">
	import { tamilToBrahmi } from '$lib/scripts/convert';

	let { data } = $props();

	const brahmiContent = $derived(tamilToBrahmi(String(data.inscription.content || '')));
</script>

<svelte:head>
	<style>
		body {
			margin: 0;
		}
	</style>
</svelte:head>

<div class="min-h-screen w-full bg-slate-950">
	<div class="mx-auto max-w-4xl">
		<h1>{data.inscription.name}</h1>
		<p class="rounded-2xl bg-slate-900/50 p-10 text-center font-serif text-5xl text-white">
			{#each brahmiContent as char}
				{char}
			{/each}
		</p>
		<p class="mt-4 text-center text-slate-400">Tamil: {data.inscription.content}</p>
		<p>{data.inscription.translation}</p>
		<a href="/" class="rounded-lg bg-blue-600 px-6 py-2 text-white">Back to Home</a>
		<a href="/learn/{data.inscription.id}" class="rounded-lg bg-green-600 px-6 py-2 text-white"
			>Start Learning</a
		>
	</div>
</div>
