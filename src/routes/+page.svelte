<script lang="ts">
	let { data } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-[#fef7ff] p-4 md:p-8">
	<div class="mx-auto flex w-full max-w-5xl flex-col items-center">
		<!-- Header -->
		<div class="mb-6 text-center md:mb-10">
			<h1 class="font-cinzel text-2xl font-bold tracking-wider text-[#1c1b1f] md:text-4xl">
				BRAHMI SCRIPT
			</h1>
			<p class="mt-2 text-sm text-[#49454f]">Learn the ancient precursors to Tamil</p>
		</div>

		<!-- Bento Grid -->
		<div class="grid w-full grid-cols-4 grid-rows-2 gap-3 md:grid-cols-12 md:grid-rows-2 md:gap-6">
			<!-- Learn Card (big) -->
			<a
				href="/learn"
				class="bento-card col-span-4 row-span-2 flex flex-col items-center justify-center rounded-2xl border border-purple-100 bg-[#f3edf7] px-8 py-8 text-center transition-all duration-300 hover:border-[#6750a4] hover:shadow-lg md:col-span-8 md:px-12 md:py-10"
			>
				<div class="mb-3 text-3xl md:text-5xl">📜</div>
				<h2
					class="font-cinzel mb-3 text-xl font-semibold tracking-wider text-[#6750a4] md:text-2xl"
				>
					Learn the Alphabet
				</h2>
				<p class="mb-4 text-sm text-[#49454f]">Master the ancient Brahmi script</p>
				<div class="mb-12 flex gap-3 md:gap-4">
					<span
						class="rounded-full border border-[#6750a4]/20 bg-[#6750a4]/10 px-4 py-1.5 text-sm text-[#6750a4]"
						>12 Vowels</span
					>
					<span
						class="rounded-full border border-[#6750a4]/20 bg-[#6750a4]/10 px-4 py-1.5 text-sm text-[#6750a4]"
						>18 Consonants</span
					>
				</div>
				<button
					style="padding-left: 40px; padding-right: 40px;"
					class="rounded-full bg-[#6750a4] py-3 text-base font-bold text-white shadow-md hover:bg-[#775fd0]"
					>Start Learning</button
				>
			</a>

			<!-- Explore Inscriptions Card -->
			<a
				href="/inscriptions"
				class="bento-card col-span-2 row-span-1 flex flex-col items-center justify-center rounded-2xl border border-[#e7e0ec] bg-[#f3edf7] px-6 py-6 text-center transition-all duration-300 hover:border-[#6750a4] hover:shadow-lg md:col-span-4 md:px-8 md:py-8"
			>
				<div class="mb-2 text-3xl md:text-4xl">🗿</div>
				<h2 class="font-cinzel text-base font-semibold tracking-wider text-[#6750a4] md:text-lg">
					Explore Inscriptions
				</h2>
				<p class="text-sm text-[#49454f]">Browse</p>
			</a>

			<!-- Daily Challenge Card -->
			<a
				href="/practice"
				class="bento-card col-span-2 row-span-1 flex flex-col items-center justify-center rounded-2xl border border-[#e7e0ec] bg-[#f3edf7] px-6 py-6 text-center transition-all duration-300 hover:border-[#6750a4] hover:shadow-lg md:col-span-4 md:px-8 md:py-8"
			>
				<div class="mb-2 text-3xl md:text-4xl">🎯</div>
				<h2 class="font-cinzel text-base font-semibold tracking-wider text-[#6750a4] md:text-lg">
					Daily Challenge
				</h2>
				<p class="text-sm text-[#49454f]">Practice</p>
			</a>
		</div>
	</div>
</div>

<style>
	.font-cinzel {
		font-family: 'Cinzel', serif;
	}

	.bento-card {
		box-shadow: 0 2px 8px rgba(103, 80, 164, 0.1);
	}

	.bento-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(103, 80, 164, 0.2);
	}
</style>
