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

<div class="relative min-h-screen w-full bg-slate-100">
	<div class="mx-auto flex max-w-7xl gap-8 p-8 lg:pt-20">
		{#if showPhaseComplete}
			<div class="phase-complete absolute inset-0 z-50 flex items-center justify-center">
				<div
					class="animate-bounce rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-center shadow-xl"
				>
					<p class="text-2xl font-bold text-white">Phase Complete!</p>
					<p class="text-sm text-amber-100">Moving to Consonants...</p>
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

		<div class="sticky top-8 hidden h-[calc(100vh-8rem)] w-1/2 lg:block">
			<div
				class="hero-card flex h-full w-full flex-col items-center justify-center rounded-3xl p-8 text-center"
			>
				{#if currentItem}
					<span
						class="mb-4 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold tracking-widest text-amber-600 uppercase"
					>
						{currentItem.type}
					</span>

					<div class="glow-animate text-[14rem] leading-none">
						<span class="brahmi-carved text-amber-500">
							{currentItem.brahmi}
						</span>
					</div>
				{/if}
			</div>
		</div>

		<div class="flex w-full flex-col gap-6 lg:w-1/2">
			<div class="mb-4">
				<a
					href="/inscriptions/{data.inscription.id}"
					class="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow-md transition-all hover:text-slate-800 hover:shadow-lg"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Return to Inscription
				</a>
			</div>

			<div class="mb-4 text-center lg:text-left">
				<h1
					class="mb-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent"
				>
					{data.inscription.name}
				</h1>
				<p class="text-sm font-medium tracking-widest text-slate-500 uppercase">{phaseLabel}</p>
			</div>

			<div class="grid grid-cols-3 gap-4">
				<div class="comparison-box rounded-2xl bg-white p-6 text-center shadow-md">
					<p class="mb-2 text-[10px] tracking-widest text-slate-500 uppercase">Brahmi</p>
					{#if currentItem}
						<p class="brahmi text-3xl text-amber-500">{currentItem.brahmi}</p>
					{/if}
				</div>
				<div class="comparison-box rounded-2xl bg-white p-6 text-center shadow-md">
					<p class="mb-2 text-[10px] tracking-widest text-slate-500 uppercase">Tamil</p>
					{#if currentItem}
						<p class="serif text-3xl text-emerald-600">{currentItem.tamil}</p>
					{/if}
				</div>
				<div class="comparison-box rounded-2xl bg-white p-6 text-center shadow-md">
					<p class="mb-2 text-[10px] tracking-widest text-slate-500 uppercase">English</p>
					{#if currentItem}
						<p class="serif text-3xl text-slate-700 italic">{currentItem.phonetic}</p>
					{/if}
				</div>
			</div>

			<div class="flex items-center justify-center gap-6">
				<button
					onclick={previous}
					class="nav-btn btn-3d btn-3d-ghost flex h-14 w-14 items-center justify-center rounded-full p-0 transition-all duration-300 hover:scale-110 active:scale-95"
				>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
						class="btn-3d btn-3d-success flex h-14 items-center justify-center px-12 font-semibold transition-all duration-300"
					>
						Finish
					</a>
				{:else}
					<button
						onclick={next}
						class="btn-3d btn-3d-primary flex h-14 items-center justify-center px-12 font-semibold transition-all duration-300"
					>
						{currentPhase === 'consonants' && currentIndex >= currentLesson.length - 2
							? 'Complete'
							: 'Next'}
					</button>
				{/if}

				<button
					onclick={next}
					class="nav-btn btn-3d btn-3d-ghost flex h-14 w-14 items-center justify-center rounded-full p-0 transition-all duration-300 hover:scale-110 active:scale-95"
				>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>

			<div class="mt-8 rounded-2xl bg-white p-6 shadow-md">
				<div class="mb-3 flex justify-between text-xs font-medium tracking-widest uppercase">
					<span class={currentPhase === 'vowels' ? 'text-amber-500' : 'text-slate-400'}>
						Uyir (Vowels)
					</span>
					<span class={currentPhase === 'consonants' ? 'text-emerald-500' : 'text-slate-400'}>
						Mei (Consonants)
					</span>
				</div>

				<div class="relative flex h-4 gap-1">
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

				<div class="mt-3 flex justify-between text-xs text-slate-500">
					<span>
						{currentPhase === 'vowels' ? currentIndex + 1 : allVowels.length} / {allVowels.length}
					</span>
					<span>
						{currentPhase === 'consonants' ? currentIndex + 1 : 0} / {allConsonants.length}
					</span>
				</div>
			</div>

			<div class="mt-auto space-y-4 py-8 text-center text-xs text-slate-400">
				<p>Use ← → keys or buttons to navigate</p>
				<p>Swipe on mobile for next/previous character</p>
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
