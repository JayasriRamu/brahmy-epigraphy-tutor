<script lang="ts">
	let { data } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-[#fef7ff] p-2 md:p-8">
	<div class="mx-auto flex w-full max-w-5xl flex-col items-center">
		<!-- Header -->
		<div class="mb-2 text-center md:mb-10">
			<h1 class="font-cinzel text-lg font-bold tracking-wider text-[#1c1b1f] md:text-4xl">
				BRAHMI SCRIPT
			</h1>
			<p class="mt-1 text-[10px] text-[#49454f] md:text-sm">
				Learn the ancient precursors to Tamil
			</p>
		</div>

		<!-- Bento Grid -->
		<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2 md:gap-6">
			<!-- Learn Card (big) -->
			<a
				href="/learn"
				style="width: 85%; margin: 0 auto;"
				class="bento-card col-span-1 flex flex-col items-center justify-center rounded-xl border border-purple-100 bg-[#f3edf7] py-6 text-center transition-all duration-300 hover:border-[#6750a4] hover:shadow-lg md:col-span-8 md:row-span-2 md:mx-0 md:w-auto md:px-12 md:py-10"
			>
				<div class="mb-2 text-2xl md:text-5xl">📜</div>
				<h2
					class="font-cinzel mb-2 text-lg font-semibold tracking-wider text-[#6750a4] md:text-2xl"
				>
					Learn the Alphabet
				</h2>
				<p class="text-xs text-[#49454f] md:text-sm" style="margin-bottom: 20px;">
					Master the ancient Brahmi script
				</p>
				<div class="mb-2" style="margin-bottom: 6px;"></div>
				<div class="flex gap-2 md:gap-4">
					<span
						class="rounded-full border border-[#6750a4]/20 bg-[#6750a4]/10 px-2 py-1 text-xs text-[#6750a4] md:px-4 md:py-1.5 md:text-sm"
						>12 Vowels</span
					>
					<span
						class="rounded-full border border-[#6750a4]/20 bg-[#6750a4]/10 px-2 py-1 text-xs text-[#6750a4] md:px-4 md:py-1.5 md:text-sm"
						>18 Consonants</span
					>
				</div>
				<div style="margin-bottom: 20px;"></div>
				<button
					style="padding-left: 30px; padding-right: 30px;"
					class="rounded-full bg-[#6750a4] py-2 text-xs font-bold text-white shadow-md hover:bg-[#775fd0] md:px-10 md:py-3 md:text-base"
					>Start Learning</button
				>
			</a>

			<!-- Explore Inscriptions Card -->
			<a
				href="/inscriptions"
				style="width: 85%; margin: 0 auto;"
				class="bento-card col-span-1 flex flex-col items-center justify-center rounded-xl border border-[#e7e0ec] bg-[#f3edf7] py-4 text-center transition-all duration-300 hover:border-[#6750a4] hover:shadow-lg md:col-span-4 md:mx-0 md:w-auto md:px-8 md:py-8"
			>
				<div class="mb-1 text-xl md:text-4xl">🗿</div>
				<h2 class="font-cinzel text-xs font-semibold tracking-wider text-[#6750a4] md:text-lg">
					Explore Inscriptions
				</h2>
				<p class="text-[10px] text-[#49454f]">Browse</p>
			</a>

			<!-- Daily Challenge Card -->
			<a
				href="/practice"
				style="width: 85%; margin: 0 auto;"
				class="bento-card col-span-1 flex flex-col items-center justify-center rounded-xl border border-[#e7e0ec] bg-[#f3edf7] py-4 text-center transition-all duration-300 hover:border-[#6750a4] hover:shadow-lg md:col-span-4 md:mx-0 md:w-auto md:px-8 md:py-8"
			>
				<div class="mb-1 text-xl md:text-4xl">🎯</div>
				<h2 class="font-cinzel text-xs font-semibold tracking-wider text-[#6750a4] md:text-lg">
					Daily Challenge
				</h2>
				<p class="text-[10px] text-[#49454f]">Practice</p>
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
