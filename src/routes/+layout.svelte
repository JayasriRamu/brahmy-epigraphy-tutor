<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';

	let { children } = $props();

	const navItems = [
		{
			href: '/learn',
			label: 'Learn',
			icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
		},
		{ href: '/practice', label: 'Practice', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
		{
			href: '/quiz',
			label: 'Quiz',
			icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		}
	];

	function isActive(href: string) {
		return $page.url.pathname.startsWith(href);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#020617] text-white">
	<nav
		class="z-50 hidden w-20 flex-col items-center border-r border-white/10 bg-[#0f172a] py-8 md:flex md:w-24"
	>
		<a href="/" class="btn-3d btn-3d-ghost flex h-12 w-12 items-center justify-center rounded-xl">
			<span class="text-xl">𑀩</span>
		</a>

		<div class="mt-8 flex flex-col gap-3">
			{#each navItems as item}
				<a
					href={item.href}
					class="btn-3d btn-3d-ghost flex w-16 flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 {isActive(
						item.href
					)
						? 'ring-2 ring-amber-400'
						: ''}"
				>
					<svg
						class="h-5 w-5 {isActive(item.href) ? 'text-amber-400' : 'text-slate-400'}"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="1.5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
					</svg>
					<span
						class="text-[10px] font-medium tracking-widest uppercase transition-opacity duration-200 {isActive(
							item.href
						)
							? 'text-amber-400'
							: 'text-slate-400 hover:text-white hover:opacity-100'}"
					>
						{item.label}
					</span>
				</a>
			{/each}
		</div>
	</nav>

	<main class="flex-1 overflow-y-auto p-4 pb-20 pl-24 md:p-10 md:pb-10 md:pl-28">
		{@render children()}
	</main>

	<nav
		class="fixed right-0 bottom-0 left-0 z-50 flex border-t border-white/10 bg-[#0f172a] p-2 md:hidden"
	>
		{#each navItems as item}
			<a
				href={item.href}
				class="btn-3d btn-3d-ghost flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-3 {isActive(
					item.href
				)
					? 'text-amber-400'
					: 'text-slate-400'}"
			>
				<svg
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
				</svg>
				<span class="text-[10px] font-medium tracking-widest uppercase">{item.label}</span>
			</a>
		{/each}
	</nav>
</div>

<style>
	:global(body) {
		overflow: hidden;
	}
</style>
