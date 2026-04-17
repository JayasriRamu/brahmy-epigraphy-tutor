<script lang="ts">
	let { data } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-[#020617] p-6">
	<div class="mx-auto flex w-full max-w-6xl flex-col items-center">
		<!-- Header (compact) -->
		<div class="mb-6 text-center">
			<h1 class="font-cinzel text-3xl font-bold tracking-wider text-white">Brahmi Script</h1>
			<p class="mt-1 text-sm text-slate-400">
				Learn the ancient precursors to Tamil and other Indian scripts
			</p>
		</div>

		<!-- Bento Grid (70vh to fit viewport) -->
		<div class="grid h-[55vh] w-full grid-cols-12 grid-rows-2 gap-6">
			<!-- Learn Card (8 cols, full height) -->
			<a
				href="/learn"
				class="bento-card col-span-8 row-span-2 flex max-h-[500px] w-full flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-8 transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20"
			>
				<div class="mb-4 text-5xl">📜</div>
				<h2 class="font-cinzel mb-3 text-2xl font-semibold tracking-wider text-white">
					Learn the Alphabet
				</h2>
				<p class="mb-5 text-center text-sm leading-relaxed text-slate-400">
					Master the ancient Brahmi script through interactive lessons
				</p>
				<div class="mb-5 flex gap-3">
					<span
						class="rounded-full border border-slate-500/50 px-4 py-1.5 text-lg font-medium text-slate-300"
					>
						12 Vowels
					</span>
					<span
						class="rounded-full border border-slate-500/50 px-4 py-1.5 text-lg font-medium text-slate-300"
					>
						18 Consonants
					</span>
				</div>
				<button class="btn-3d btn-3d-primary rounded-2xl">
					Start Learning
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</a>

			<!-- Explore Inscriptions Card (4 cols, top half) -->
			<a
				href="/inscriptions"
				class="bento-card col-span-4 row-span-1 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20"
			>
				<div class="mb-2 text-4xl">🗿</div>
				<h2 class="font-cinzel mb-1 text-lg font-semibold tracking-wider text-white">
					Explore Inscriptions
				</h2>
				<p class="mb-2 text-center text-xs text-slate-400">Discover ancient Brahmi inscriptions</p>
				<div class="mt-auto flex items-center gap-2 text-emerald-400">
					<span class="text-sm font-medium">Browse</span>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</div>
			</a>

			<!-- Daily Challenge Card (4 cols, bottom half) -->
			<a
				href="/practice"
				class="bento-card col-span-4 row-span-1 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20"
			>
				<div class="mb-2 text-4xl">🎯</div>
				<h2 class="font-cinzel mb-1 text-lg font-semibold tracking-wider text-white">
					Daily Challenge
				</h2>
				<p class="mb-2 text-center text-xs text-slate-400">Test your knowledge</p>
				<div class="mt-auto flex items-center gap-2 text-blue-400">
					<span class="text-sm font-medium">Practice</span>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</div>
			</a>
		</div>
	</div>
</div>

<style>
	.font-cinzel {
		font-family: 'Cinzel', serif;
	}

	.bento-card {
		box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
	}

	.bento-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 0 rgba(0, 0, 0, 0.3);
	}
</style>
