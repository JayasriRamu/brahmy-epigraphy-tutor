<script lang="ts">
	import { ALPHABET, type BrahmiChar } from '$lib/scripts/alphabet';
	import { tamilToBrahmi } from '$lib/scripts/convert';
	import { fly, fade } from 'svelte/transition';

	const ALPHABET_ARRAY = Object.values(ALPHABET);

	let { data }: { data: { inscription?: { content: string; name: string } } } = $props();

	const DEFAULT_WORDS = [
		{ tamil: 'அம்மா', english: 'Mother' },
		{ tamil: 'அப்ப', english: 'Father/Now' },
		{ tamil: 'படம்', english: 'Picture' },
		{ tamil: 'கடமை', english: 'Duty' },
		{ tamil: 'ஐயா', english: 'Sir/Father' },
		{ tamil: 'தமிழ்', english: 'Tamil' },
		{ tamil: 'மணி', english: 'Bell/Time' },
		{ tamil: 'கல்', english: 'Stone' }
	];

	const WORDS = data.inscription?.content
		? [{ tamil: data.inscription.content, english: data.inscription.name }]
		: DEFAULT_WORDS;

	type AlphabetTab = 'vowels' | 'consonants' | 'special';
	let activeTab = $state<AlphabetTab>('vowels');

	let lessonMode = $state(false);

	type Mode = 'study' | 'challenge' | 'word';
	let mode = $state<Mode>('study');

	let challengeTarget = $state(ALPHABET_ARRAY[0]);
	let challengeFeedback = $state('Match the sound!');
	let score = $state(0);

	let currentWordIndex = $state(0);
	let userSequence = $state<string[]>([]);
	let showSuccess = $state(false);
	let wordFeedback = $state('Spell the word by clicking Brahmi letters in order');
	let showHint = $state(false);
	let hintHighlightIndex = $state<number | null>(null);

	let sliderDirection = $state<'left' | 'right'>('right');

	const vowels = $derived(ALPHABET_ARRAY.filter((c) => c.type === 'Uyir'));
	const consonants = $derived(
		ALPHABET_ARRAY.filter((c) => c.type === 'Mei' || c.type === 'Uyirmei')
	);
	const special = $derived(ALPHABET_ARRAY.filter((c) => c.type === 'Special'));

	const vallinam = $derived(
		consonants.filter((c) => ['க', 'ச', 'ட', 'த', 'ப', 'ற'].includes(c.tamil))
	);
	const mellinam = $derived(
		consonants.filter((c) => ['ங', 'ஞ', 'ண', 'ந', 'ம', 'ன'].includes(c.tamil))
	);
	const idaiyinam = $derived(
		consonants.filter((c) => ['ய', 'ர', 'ல', 'வ', 'ழ', 'ள'].includes(c.tamil))
	);

	const consonantSections = $derived([
		{ name: 'Vallinam', subtitle: 'Hard', chars: vallinam, color: 'red' },
		{ name: 'Mellinam', subtitle: 'Soft', chars: mellinam, color: 'blue' },
		{ name: 'Idaiyinam', subtitle: 'Medium', chars: idaiyinam, color: 'purple' }
	]);

	const currentTabChars = $derived(
		activeTab === 'vowels' ? vowels : activeTab === 'consonants' ? consonants : special
	);

	let sliderIndex = $state(0);
	let currentSliderChar = $derived(currentTabChars[sliderIndex]);
	let progressPercent = $derived(((sliderIndex + 1) / currentTabChars.length) * 100);

	function startMode(newMode: Mode) {
		mode = newMode;
		resetGame();
	}

	function resetGame() {
		userSequence = [];
		showSuccess = false;
		showHint = false;
		hintHighlightIndex = null;
		score = 0;
		sliderIndex = 0;
		wordFeedback = 'Spell the word by clicking Brahmi letters in order';
		if (mode === 'challenge') nextChallenge();
	}

	function nextSlider() {
		if (sliderIndex < currentTabChars.length - 1) {
			sliderDirection = 'right';
			sliderIndex++;
		}
	}

	function prevSlider() {
		if (sliderIndex > 0) {
			sliderDirection = 'left';
			sliderIndex--;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (mode !== 'study' || !lessonMode) return;
		if (e.key === 'Escape') {
			lessonMode = false;
			return;
		}
		if (e.key === 'ArrowRight') nextSlider();
		if (e.key === 'ArrowLeft') prevSlider();
	}

	function nextChallenge() {
		challengeTarget = ALPHABET_ARRAY[Math.floor(Math.random() * ALPHABET_ARRAY.length)];
	}

	function checkChallenge(char: BrahmiChar) {
		if (char.brahmi === challengeTarget.brahmi) {
			score += 1;
			challengeFeedback = `Correct! ${char.brahmi} = ${char.phonetic}`;
			setTimeout(() => {
				challengeFeedback = 'Keep going!';
				nextChallenge();
			}, 1000);
		} else {
			challengeFeedback = 'Try again!';
		}
	}

	function handleWordInput(letter: string) {
		if (showSuccess) return;
		const expectedLetter = currentWordBrahmi[userSequence.length];
		if (letter === expectedLetter) {
			userSequence.push(letter);
			showHint = false;
			hintHighlightIndex = null;
			wordFeedback = 'Correct letter!';
			if (userSequence.length === currentWordBrahmi.length) {
				showSuccess = true;
				wordFeedback = 'Perfect! Word Complete!';
				setTimeout(nextWord, 2000);
			}
		} else {
			wordFeedback = 'Wrong letter, try the sequence again!';
			userSequence = [];
			showHint = false;
			hintHighlightIndex = null;
		}
	}

	function toggleHint() {
		showHint = !showHint;
		if (showHint && nextHintChar) {
			const idx = ALPHABET_ARRAY.findIndex((c) => c.brahmi === nextHintChar);
			hintHighlightIndex = idx;
		} else {
			hintHighlightIndex = null;
		}
	}

	function nextWord() {
		showSuccess = false;
		userSequence = [];
		showHint = false;
		hintHighlightIndex = null;
		currentWordIndex = (currentWordIndex + 1) % WORDS.length;
		wordFeedback = 'Next word: ' + WORDS[currentWordIndex].tamil;
	}

	const currentWord = $derived(WORDS[currentWordIndex]);
	const currentWordBrahmi = $derived(tamilToBrahmi(currentWord.tamil));
	const nextHintChar = $derived(currentWordBrahmi[userSequence.length] || null);
	const hintInfo = $derived(
		nextHintChar ? Object.values(ALPHABET).find((c) => c.brahmi === nextHintChar) : null
	);

	const tabColor = $derived(
		activeTab === 'vowels' ? 'amber' : activeTab === 'consonants' ? 'emerald' : 'blue'
	);
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Global Nav -->
<nav
	class="flex min-h-[80px] w-full items-center justify-center gap-12 border-b border-white/5 py-8 text-center"
>
	<div class="flex justify-center gap-8">
		<button
			onclick={() => startMode('study')}
			class="text-base font-medium transition-colors {mode === 'study'
				? 'font-semibold text-white'
				: 'text-white/30 hover:text-white/60'}"
		>
			Study
		</button>
		<button
			onclick={() => startMode('challenge')}
			class="text-base font-medium transition-colors {mode === 'challenge'
				? 'font-semibold text-white'
				: 'text-white/30 hover:text-white/60'}"
		>
			Challenge
		</button>
		<button
			onclick={() => startMode('word')}
			class="text-base font-medium transition-colors {mode === 'word'
				? 'font-semibold text-white'
				: 'text-white/30 hover:text-white/60'}"
		>
			Word Building
		</button>
	</div>
</nav>

<!-- Main Content -->
<div class="flex min-h-screen flex-col bg-[#0f172a] font-sans text-white">
	<!-- Main Header Section -->
	<header class="flex flex-col items-center gap-6 py-16 pb-12">
		<h1 class="font-cinzel text-5xl font-bold text-white">Brahmi Script Tutor</h1>
		<p class="text-sm text-slate-400">
			{#if mode === 'study'}Master the ancient precursors to the Tamil script.
			{:else if mode === 'challenge'}Test your character recognition.
			{:else}Connect the letters to form words.{/if}
		</p>

		{#if mode === 'study'}
			<!-- Tab Switcher -->
			<div class="mt-4 flex gap-8 rounded-full bg-white/5 px-8 py-3">
				<button
					onclick={() => {
						activeTab = 'vowels';
						sliderIndex = 0;
					}}
					class="text-lg font-medium transition-colors {activeTab === 'vowels'
						? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]'
						: 'text-white/30 hover:text-white/60'}"
				>
					Vowels
				</button>
				<button
					onclick={() => {
						activeTab = 'consonants';
						sliderIndex = 0;
					}}
					class="text-lg font-medium transition-colors {activeTab === 'consonants'
						? 'text-white'
						: 'text-white/30 hover:text-white/60'}"
				>
					Consonants
				</button>
				<button
					onclick={() => {
						activeTab = 'special';
						sliderIndex = 0;
					}}
					class="text-lg font-medium transition-colors {activeTab === 'special'
						? 'text-white'
						: 'text-white/30 hover:text-white/60'}"
				>
					Special
				</button>
			</div>

			<!-- View Toggle -->
			<div class="mt-8">
				<button
					onclick={() => {
						lessonMode = !lessonMode;
						sliderIndex = 0;
					}}
					class="rounded-xl px-6 py-3 text-sm font-medium transition-all {lessonMode
						? 'border border-white/30 bg-white/20 text-white backdrop-blur-md hover:bg-white/30 active:scale-95'
						: 'border border-white/10 bg-white/5 text-white backdrop-blur-md hover:bg-white/10'}"
				>
					{lessonMode ? 'Exit Lesson Mode' : 'Enter Lesson Mode'}
				</button>
			</div>
		{/if}
	</header>

	<!-- Content Section -->
	{#if mode === 'study'}
		{#if lessonMode}
			<!-- LESSON MODE VIEW -->
			<div class="relative flex min-h-[600px] w-full items-center justify-center">
				<div class="mx-auto w-full max-w-3xl px-4">
					<div
						class="rounded-3xl border border-white/10 bg-slate-800/50 p-10 text-center shadow-2xl backdrop-blur-md"
					>
						<!-- Progress Bar -->
						<div class="mb-8">
							<div class="mb-3 flex items-center justify-between text-sm">
								<span
									class={tabColor === 'amber'
										? 'text-amber-400'
										: tabColor === 'emerald'
											? 'text-emerald-400'
											: 'text-blue-400'}
								>
									{activeTab === 'vowels'
										? 'Vowel'
										: activeTab === 'consonants'
											? 'Consonant'
											: 'Special'}
								</span>
								<span class="font-mono text-slate-400"
									>{sliderIndex + 1} of {currentTabChars.length}</span
								>
							</div>
							<div class="h-1 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
								<div
									class="h-full rounded-full bg-white shadow-[0_0_8px_#fff,0_0_16px_rgba(255,255,255,0.5)] transition-all duration-500"
									style="width: {progressPercent}%"
								></div>
							</div>
						</div>

						<!-- Glowing Brahmi Character -->
						{#key sliderIndex}
							<div
								class="mb-8 flex h-64 items-center justify-center font-serif text-[14rem] leading-none text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
								in:fly={{ x: sliderDirection === 'right' ? 50 : -50, duration: 300 }}
							>
								{currentSliderChar.brahmi}
							</div>
						{/key}

						<!-- Info Row -->
						<div class="flex items-center justify-center gap-12 border-t border-white/10 pt-8">
							<div class="text-center">
								<span class="mb-1 block text-xs tracking-widest text-slate-500 uppercase"
									>Phonetic</span
								>
								<span class="text-3xl font-bold text-white">{currentSliderChar.phonetic}</span>
							</div>
							<div class="h-12 w-px bg-white/20"></div>
							<div class="text-center">
								<span class="mb-1 block text-xs tracking-widest text-slate-500 uppercase"
									>Tamil</span
								>
								<span class="text-3xl font-bold text-white">{currentSliderChar.tamil}</span>
							</div>
						</div>

						<!-- Previous / Next Buttons -->
						<div class="mt-8 flex items-center justify-center gap-6">
							<button
								onclick={prevSlider}
								disabled={sliderIndex === 0}
								class="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/40 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
							>
								<svg
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2.5"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
								</svg>
							</button>
							<button
								onclick={nextSlider}
								disabled={sliderIndex === currentTabChars.length - 1}
								class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
							>
								<svg
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2.5"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<!-- GRID VIEW -->
			{#key activeTab}
				<div in:fade={{ duration: 300 }} class="flex w-full flex-col items-center px-4">
					{#if activeTab === 'consonants'}
						<div class="mx-auto w-full max-w-[1200px] space-y-12">
							{#each consonantSections as section}
								<div class="w-full">
									<h2
										class="font-cinzel mb-6 w-full text-center text-xl font-semibold tracking-widest uppercase {section.color ===
										'red'
											? 'text-red-400'
											: section.color === 'blue'
												? 'text-blue-400'
												: 'text-purple-400'}"
									>
										{section.name}
										<span class="text-sm font-normal text-slate-500">({section.subtitle})</span>
									</h2>
									<div
										class="mx-auto grid max-w-[1200px] grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6"
									>
										{#each section.chars as char}
											<div
												class="alphabet-card flex h-56 w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 text-center shadow-lg backdrop-blur-md transition-all hover:border-{section.color ===
												'red'
													? 'red'
													: section.color === 'blue'
														? 'blue'
														: 'purple'}-500/50"
											>
												<div
													class="mb-4 text-[3.5rem] leading-none text-slate-50"
													style="text-shadow: 0 0 12px rgba(255,255,255,0.3);"
												>
													{char.brahmi}
												</div>
												<div class="flex flex-col items-center gap-2 border-t border-white/10 pt-3">
													<span class="text-4xl font-bold text-emerald-400">{char.tamil}</span>
													<span class="text-xl text-white/80">{char.phonetic}</span>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<h2
							class="font-cinzel mt-12 mb-8 text-center text-xl font-semibold tracking-[0.2em] uppercase {tabColor ===
							'amber'
								? 'text-amber-400/80'
								: tabColor === 'emerald'
									? 'text-emerald-400'
									: 'text-blue-400'}"
						>
							{activeTab === 'vowels' ? 'THE 12 HOLY VOWELS' : 'SPECIAL CHARACTERS'}
						</h2>
						<div
							class="mx-auto grid w-full max-w-[1200px] grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6"
						>
							{#each currentTabChars as char}
								<div
									class="alphabet-card flex h-56 w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 text-center shadow-lg backdrop-blur-md transition-all hover:border-{tabColor ===
									'amber'
										? 'amber'
										: tabColor === 'emerald'
											? 'emerald'
											: 'blue'}-500/50"
								>
									<div
										class="mb-4 text-[3.5rem] leading-none text-slate-50"
										style="text-shadow: 0 0 12px rgba(255,255,255,0.3);"
									>
										{char.brahmi}
									</div>
									<div class="flex flex-col items-center gap-2 border-t border-white/10 pt-3">
										<span class="text-4xl font-bold text-emerald-400">{char.tamil}</span>
										<span class="text-xl text-white/80">{char.phonetic}</span>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/key}
		{/if}
	{:else if mode === 'challenge'}
		<section
			class="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md"
		>
			<div class="mb-4 flex justify-between text-sm tracking-widest text-slate-400 uppercase">
				<span>Challenge Mode</span>
				<span>Score: {score}</span>
			</div>
			<h3 class="mb-1 text-center text-slate-400">Find the character for:</h3>
			<div class="mb-6 text-center text-6xl font-black text-white uppercase">
				{challengeTarget.phonetic}
			</div>
			<p class="mb-8 h-6 text-center text-blue-400">{challengeFeedback}</p>
			<div class="grid grid-cols-5 gap-3">
				{#each ALPHABET_ARRAY as char}
					<button
						onclick={() => checkChallenge(char)}
						class="flex aspect-square items-center justify-center rounded-lg bg-white/5 text-2xl backdrop-blur-md transition-all hover:bg-white/10 active:scale-95"
					>
						{char.brahmi}
					</button>
				{/each}
			</div>
		</section>
	{:else if mode === 'word'}
		<section class="mx-auto max-w-xl text-center">
			<div
				class="mb-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md {showSuccess
					? 'border-green-500'
					: ''} transition-all"
			>
				<span class="text-sm font-semibold tracking-widest text-blue-500 uppercase"
					>Modern Tamil</span
				>
				<div
					class="mb-2 text-6xl font-bold text-white uppercase transition-transform {showSuccess
						? 'scale-110'
						: ''}"
				>
					{currentWord.tamil}
				</div>
				<p class="mb-6 text-slate-400 italic">{currentWord.english}</p>

				<div class="mb-4 flex justify-center gap-2">
					{#if showHint && hintInfo}
						<div class="rounded-lg bg-yellow-500/20 px-4 py-2 text-sm text-yellow-400">
							Hint: Look for <span class="font-bold">{hintInfo.brahmi}</span>
							({hintInfo.phonetic})
						</div>
					{/if}
				</div>

				<div class="mb-8 flex justify-center gap-3">
					{#each currentWordBrahmi as letter, i}
						<div
							class="flex h-16 w-14 items-center justify-center rounded-lg border-2 text-3xl font-bold transition-all {userSequence[
								i
							]
								? 'border-green-500 bg-green-500/10 text-white'
								: showHint && i === userSequence.length
									? 'animate-pulse border-yellow-500 bg-yellow-500/10 text-yellow-400'
									: 'border-white/10 bg-white/5 text-transparent backdrop-blur-md'}"
						>
							{userSequence[i] || ''}
						</div>
					{/each}
				</div>

				<p class="mb-4 text-sm font-medium {showSuccess ? 'text-green-400' : 'text-blue-400'}">
					{wordFeedback}
				</p>

				<div class="mb-6 flex justify-center gap-3">
					<button
						onclick={toggleHint}
						disabled={showSuccess || userSequence.length === currentWordBrahmi.length}
						class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {showHint
							? 'bg-yellow-600 text-white'
							: 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'} disabled:opacity-50"
					>
						{showHint ? 'Hide Hint' : 'Show Hint'}
					</button>
				</div>

				<div class="grid grid-cols-7 gap-2">
					{#each ALPHABET_ARRAY as char, idx}
						<button
							onclick={() => handleWordInput(char.brahmi)}
							disabled={showSuccess}
							class="flex aspect-square items-center justify-center rounded text-xl transition-all hover:bg-blue-600 disabled:opacity-50 {hintHighlightIndex ===
							idx
								? 'bg-yellow-500/50 ring-2 ring-yellow-400'
								: 'bg-white/5 backdrop-blur-md hover:bg-white/10'}"
						>
							{char.brahmi}
						</button>
					{/each}
				</div>
			</div>

			{#if showSuccess}
				<div class="pointer-events-none fixed inset-0 flex items-center justify-center">
					<div class="animate-ping text-8xl">✨</div>
				</div>
			{/if}
		</section>
	{/if}
</div>

<style>
	.font-cinzel {
		font-family: 'Cinzel', serif;
	}

	.alphabet-card {
		min-width: 8rem;
	}

	.alphabet-card:hover {
		transform: translateY(-2px);
	}
</style>
