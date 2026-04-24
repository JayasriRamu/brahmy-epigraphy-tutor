<script lang="ts">
	import { ALPHABET, type BrahmiChar } from '$lib/scripts/alphabet';

	type LessonItem = { key: string } & BrahmiChar;

	let { data }: { data: { inscription: { id: string; content: string; name: string } } } = $props();

	const allVowels = Object.entries(ALPHABET)
		.filter((entry): entry is [string, BrahmiChar] => entry[1].type === 'Uyir')
		.map(([key, v]) => ({
			key,
			tamil: v.tamil,
			brahmi: v.brahmi,
			phonetic: v.phonetic,
			type: v.type
		}));

	const allConsonants = Object.entries(ALPHABET)
		.filter(
			(entry): entry is [string, BrahmiChar] =>
				entry[1].type === 'Mei' || entry[1].type === 'Uyirmei'
		)
		.map(([key, v]) => ({
			key,
			tamil: v.tamil,
			brahmi: v.brahmi,
			phonetic: v.phonetic,
			type: v.type
		}));

	type Phase = 'vowels' | 'consonants';
	let currentPhase = $state<Phase>('vowels');
	let currentIndex = $state(0);
	let showPhaseComplete = $state(false);
	let consonantsJustStarted = $state(false);

	const currentLesson = $derived<LessonItem[]>(
		currentPhase === 'vowels' ? allVowels : allConsonants
	);

	const totalLessons = $derived(allVowels.length + allConsonants.length);
	const currentLessonIndex = $derived(
		currentPhase === 'vowels' ? currentIndex : allVowels.length + currentIndex
	);

	const currentItem = $derived(currentLesson[currentIndex]);

	const progress = $derived(((currentLessonIndex + 1) / totalLessons) * 100);

	const phaseLabel = $derived(
		currentPhase === 'vowels' ? 'Phase 1: Vowels (Uyir)' : 'Phase 2: Consonants (Mei/Uyirmei)'
	);

	const isComplete = $derived(
		currentPhase === 'consonants' && currentIndex >= allConsonants.length - 1
	);

	function next() {
		if (currentIndex < currentLesson.length - 1) {
			currentIndex++;
		} else if (currentPhase === 'vowels') {
			showPhaseComplete = true;
			setTimeout(() => {
				showPhaseComplete = false;
				currentPhase = 'consonants';
				currentIndex = 0;
				consonantsJustStarted = true;
				setTimeout(() => (consonantsJustStarted = false), 1500);
			}, 1500);
		}
	}

	function previous() {
		if (currentIndex > 0) {
			currentIndex--;
		} else if (currentPhase === 'consonants') {
			currentPhase = 'vowels';
			currentIndex = allVowels.length - 1;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' || e.key === ' ') {
			next();
		} else if (e.key === 'ArrowLeft') {
			previous();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Noto+Sans+Brahmi:wght@400;700;900&family=Cormorant+Garamond:wght@400;600&display=swap"
		rel="stylesheet"
	/>
	<style>
		body {
			margin: 0;
		}
		@keyframes glow {
			0%,
			100% {
				filter: drop-shadow(0 0 30px rgba(245, 158, 11, 0.4));
			}
			50% {
				filter: drop-shadow(0 0 60px rgba(245, 158, 11, 0.7));
			}
		}
		.glow-animate {
			animation: glow 3s ease-in-out infinite;
		}
		.phase-complete {
			z-index: 100;
		}
		.confetti {
			position: fixed;
			inset: 0;
			pointer-events: none;
			overflow: hidden;
		}
		.confetti-piece {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 10px;
			height: 10px;
			background: linear-gradient(135deg, #f59e0b, #fbbf24, #10b981, #6366f1);
			border-radius: 50%;
			animation: confetti-fall 1.5s ease-out forwards;
			animation-delay: var(--delay);
			transform: translate(var(--x), -50%);
		}
		@keyframes confetti-fall {
			0% {
				opacity: 1;
				transform: translate(var(--x), -50%) rotate(0deg);
			}
			100% {
				opacity: 0;
				transform: translate(var(--x), 100vh) rotate(720deg);
			}
		}
	</style>
</svelte:head>

<div
	class="fixed inset-0 w-full overflow-y-auto bg-slate-100 lg:relative lg:block lg:h-auto lg:min-h-screen lg:overflow-visible"
>
	<div
		class="mx-auto flex min-h-full flex-col justify-between p-3 pb-24 lg:max-w-7xl lg:gap-4 lg:p-4 lg:pt-8 lg:pb-10"
	>
		{#if showPhaseComplete}
			<div class="phase-complete fixed inset-0 z-50 flex items-center justify-center lg:absolute">
				<div
					class="animate-bounce rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-center shadow-xl"
				>
					<p class="text-xl font-bold text-white">Phase Complete!</p>
					<p class="text-xs text-amber-100">Moving to Consonants...</p>
				</div>
			</div>
			<div class="confetti">
				{#each Array(20) as _, i}
					<div
						class="confetti-piece"
						style="--delay: {i * 0.1}s; --x: {(Math.random() - 0.5) * 200}px;"
					></div>
				{/each}
			</div>
		{/if}

		<div class="hidden lg:sticky lg:top-8 lg:block lg:h-[calc(100vh-8rem)] lg:w-1/2">
			<div
				class="hero-card flex h-full w-full flex-col items-center justify-center rounded-2xl p-6 text-center lg:rounded-3xl lg:p-8"
			>
				{#if currentItem}
					<span
						class="mb-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold tracking-widest text-amber-600 uppercase lg:mb-4 lg:px-3 lg:py-1"
					>
						{currentItem.type}
					</span>

					<div class="glow-animate text-[8rem] leading-none lg:text-[14rem]">
						<span class="brahmi-carved text-amber-500">
							{currentItem.brahmi}
						</span>
					</div>
				{/if}
			</div>
		</div>

		<div class="flex w-full flex-col gap-2 lg:w-1/2 lg:gap-6">
			<div>
				<a
					href="/inscriptions/{data.inscription.id}"
					class="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-md transition-all hover:text-slate-800 hover:shadow-lg lg:gap-2 lg:px-5 lg:py-2 lg:text-sm"
				>
					<svg class="h-3 w-3 lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					<span class="hidden lg:inline">Return to Inscription</span>
					<span class="lg:hidden">Back</span>
				</a>
			</div>

			<div class="text-center lg:text-left">
				<h1
					class="mb-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-xl font-bold tracking-tight text-transparent lg:text-3xl"
				>
					{data.inscription.name}
				</h1>
				<p class="text-xs font-medium tracking-widest text-slate-500 uppercase">{phaseLabel}</p>
			</div>

			<div class="glow-animate text-center text-5xl leading-none lg:hidden">
				<span class="brahmi-carved text-amber-500">
					{currentItem?.brahmi}
				</span>
			</div>

			<div class="grid grid-cols-3 gap-1 lg:gap-4">
				<div
					class="comparison-box rounded-xl bg-white p-2 text-center shadow-md lg:rounded-2xl lg:p-6"
				>
					<p
						class="mb-1 text-[6px] tracking-widest text-slate-500 uppercase lg:mb-2 lg:text-[10px]"
					>
						Brahmi
					</p>
					{#if currentItem}
						<p class="brahmi text-lg text-amber-500 lg:text-3xl">{currentItem.brahmi}</p>
					{/if}
				</div>
				<div
					class="comparison-box rounded-xl bg-white p-2 text-center shadow-md lg:rounded-2xl lg:p-6"
				>
					<p
						class="mb-1 text-[6px] tracking-widest text-slate-500 uppercase lg:mb-2 lg:text-[10px]"
					>
						Tamil
					</p>
					{#if currentItem}
						<p class="serif text-lg text-emerald-600 lg:text-3xl">{currentItem.tamil}</p>
					{/if}
				</div>
				<div
					class="comparison-box rounded-xl bg-white p-2 text-center shadow-md lg:rounded-2xl lg:p-6"
				>
					<p
						class="mb-1 text-[6px] tracking-widest text-slate-500 uppercase lg:mb-2 lg:text-[10px]"
					>
						English
					</p>
					{#if currentItem}
						<p class="serif text-lg text-slate-700 italic lg:text-3xl">{currentItem.phonetic}</p>
					{/if}
				</div>
			</div>

			<div class="flex items-center justify-center gap-2 lg:gap-6">
				<button
					onclick={previous}
					class="nav-btn btn-3d btn-3d-ghost flex h-10 w-10 items-center justify-center rounded-full p-0 transition-all duration-300 hover:scale-110 active:scale-95 lg:h-14 lg:w-14"
				>
					<svg class="h-4 w-4 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				{#if isComplete}
					<a
						href="/inscriptions/{data.inscription.id}"
						class="btn-3d btn-3d-success flex h-10 items-center justify-center px-4 font-semibold transition-all duration-300 lg:h-14 lg:px-12"
					>
						Finish
					</a>
				{:else}
					<button
						onclick={next}
						class="btn-3d btn-3d-primary flex h-10 items-center justify-center px-4 font-semibold transition-all duration-300 lg:h-14 lg:px-12"
					>
						{currentPhase === 'consonants' && currentIndex >= currentLesson.length - 2
							? 'Complete'
							: 'Next'}
					</button>
				{/if}

				<button
					onclick={next}
					class="nav-btn btn-3d btn-3d-ghost flex h-10 w-10 items-center justify-center rounded-full p-0 transition-all duration-300 hover:scale-110 active:scale-95 lg:h-14 lg:w-14"
				>
					<svg class="h-4 w-4 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>

			<div class="rounded-xl bg-white p-3 shadow-md lg:rounded-2xl lg:p-6">
				<div
					class="mb-2 flex justify-between text-[10px] font-medium tracking-widest uppercase lg:mb-3 lg:text-xs"
				>
					<span class={currentPhase === 'vowels' ? 'text-amber-500' : 'text-slate-400'}>
						Uyir (Vowels)
					</span>
					<span class={currentPhase === 'consonants' ? 'text-emerald-500' : 'text-slate-400'}>
						Mei (Consonants)
					</span>
				</div>

				<div class="relative flex h-3 gap-1 lg:h-4">
					<div class="flex-1">
						<div
							class="h-full overflow-hidden rounded-full bg-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
						>
							<div
								class="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 {currentPhase ===
									'vowels' && currentIndex === allVowels.length - 1
									? 'glow-pulse'
									: ''}"
								style="width: {currentPhase === 'vowels'
									? ((currentIndex + 1) / allVowels.length) * 100
									: 100}%"
							></div>
						</div>
					</div>
					<div class="flex-1">
						<div
							class="h-full overflow-hidden rounded-full bg-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
						>
							<div
								class="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 {consonantsJustStarted
									? 'emerald-pulse'
									: ''}"
								style="width: {currentPhase === 'consonants'
									? ((currentIndex + 1) / allConsonants.length) * 100
									: 0}%"
							></div>
						</div>
					</div>
				</div>

				<div class="mt-2 flex justify-between text-[10px] text-slate-500 lg:mt-3 lg:text-xs">
					<span>
						{currentPhase === 'vowels' ? currentIndex + 1 : allVowels.length} / {allVowels.length}
					</span>
					<span>
						{currentPhase === 'consonants' ? currentIndex + 1 : 0} / {allConsonants.length}
					</span>
				</div>
			</div>

			<div class="mt-auto py-2 text-center text-[10px] text-slate-400 lg:py-8 lg:text-xs">
				<p>Use ← → keys or buttons to navigate</p>
			</div>
		</div>
	</div>
</div>

<style>
	.hero-card {
		background: white;
		border: 2px solid #e2e8f0;
		box-shadow: 0 4px 0 0 #cbd5e1;
	}

	.comparison-box {
		border: 2px solid #e2e8f0;
	}

	.nav-btn {
		border: 2px solid #e2e8f0;
	}

	.nav-btn:hover {
		background: #f1f5f9;
	}

	.brahmi-carved {
		font-family: 'Noto Sans Brahmi', serif;
		font-weight: 900;
	}

	.glow-animate {
		animation: soft-glow 3s ease-in-out infinite;
	}

	@keyframes soft-glow {
		0%,
		100% {
			filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.3));
		}
		50% {
			filter: drop-shadow(0 0 40px rgba(245, 158, 11, 0.5));
		}
	}

	.brahmi {
		font-family: 'Noto Sans Brahmi', serif;
		font-weight: 700;
	}

	.serif {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-weight: 600;
	}

	@keyframes glow-pulse {
		0%,
		100% {
			box-shadow:
				0 0 15px rgba(245, 158, 11, 0.6),
				0 0 30px rgba(245, 158, 11, 0.3);
		}
		50% {
			box-shadow:
				0 0 25px rgba(245, 158, 11, 0.9),
				0 0 50px rgba(245, 158, 11, 0.6);
		}
	}

	@keyframes emerald-pulse {
		0%,
		100% {
			box-shadow:
				0 0 15px rgba(16, 185, 129, 0.6),
				0 0 30px rgba(16, 185, 129, 0.3);
		}
		50% {
			box-shadow:
				0 0 25px rgba(16, 185, 129, 0.9),
				0 0 50px rgba(16, 185, 129, 0.6);
		}
	}

	.glow-pulse {
		animation: glow-pulse 0.8s ease-in-out 3;
	}

	.emerald-pulse {
		animation: emerald-pulse 0.8s ease-in-out 3;
	}
</style>
