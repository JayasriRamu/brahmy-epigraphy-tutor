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
		if (e.key === '1') {
			activeTab = 'vowels';
			sliderIndex = 0;
		}
		if (e.key === '2') {
			activeTab = 'consonants';
			sliderIndex = 0;
		}
		if (e.key === '3') {
			activeTab = 'special';
			sliderIndex = 0;
		}
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
	class="flex min-h-[80px] w-full items-center justify-center gap-12 border-b border-[#e7e0ec] py-6 text-center"
>
	<div class="flex justify-center gap-8">
		<button
			onclick={() => startMode('study')}
			class="text-base font-medium transition-colors {mode === 'study'
				? 'font-semibold text-[#6750a4]'
				: 'text-[#49454f] hover:text-[#6750a4]'}"
		>
			Study
		</button>
		<button
			onclick={() => startMode('challenge')}
			class="text-base font-medium transition-colors {mode === 'challenge'
				? 'font-semibold text-[#6750a4]'
				: 'text-[#49454f] hover:text-[#6750a4]'}"
		>
			Challenge
		</button>
		<button
			onclick={() => startMode('word')}
			class="text-base font-medium transition-colors {mode === 'word'
				? 'font-semibold text-[#6750a4]'
				: 'text-[#49454f] hover:text-[#6750a4]'}"
		>
			Word Building
		</button>
	</div>
</nav>

<!-- Main Content -->
<div class="flex min-h-screen flex-col bg-[#fef7ff] font-sans text-[#1c1b1f]">
	<!-- Main Header Section -->
	<header class="flex flex-col items-center gap-6 py-16 pb-12">
		<h1 class="font-cinzel text-5xl font-bold text-[#1c1b1f]">Brahmi Script Tutor</h1>
		<p class="text-sm text-[#49454f]">
			{#if mode === 'study'}Master the ancient precursors to the Tamil script.
			{:else if mode === 'challenge'}Test your character recognition.
			{:else}Connect the letters to form words.{/if}
		</p>

		{#if mode === 'study'}
			<!-- Tab Switcher -->
			<div class="mt-4 flex gap-8 rounded-full bg-[#f3edf7] px-8 py-3">
				<button
					onclick={() => {
						activeTab = 'vowels';
						sliderIndex = 0;
					}}
					class="text-lg font-medium transition-colors {activeTab === 'vowels'
						? 'font-semibold text-[#6750a4]'
						: 'text-[#49454f] hover:text-[#6750a4]'}"
				>
					Vowels
				</button>
				<button
					onclick={() => {
						activeTab = 'consonants';
						sliderIndex = 0;
					}}
					class="text-lg font-medium transition-colors {activeTab === 'consonants'
						? 'font-semibold text-[#6750a4]'
						: 'text-[#49454f] hover:text-[#6750a4]'}"
				>
					Consonants
				</button>
				<button
					onclick={() => {
						activeTab = 'special';
						sliderIndex = 0;
					}}
					class="text-lg font-medium transition-colors {activeTab === 'special'
						? 'font-semibold text-[#6750a4]'
						: 'text-[#49454f] hover:text-[#6750a4]'}"
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
					class="rounded-full px-8 py-3 text-sm font-medium shadow-md transition-all {lessonMode
						? 'bg-[#6750a4] text-white hover:bg-[#7f67be]'
						: 'bg-[#f3edf7] text-[#6750a4] hover:bg-[#e8def8]'}"
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
					<div class="rounded-3xl border border-[#cac4d0] bg-[#f3edf7] p-10 text-center shadow-lg">
						<!-- Progress Bar -->
						<div class="mb-8">
							<div class="mb-3 flex items-center justify-between text-sm">
								<span
									class={tabColor === 'amber'
										? 'text-[#b08d00]'
										: tabColor === 'emerald'
											? 'text-[#14b8a6]'
											: 'text-[#6750a4]'}
								>
									{activeTab === 'vowels'
										? 'Vowel'
										: activeTab === 'consonants'
											? 'Consonant'
											: 'Special'}
								</span>
								<span class="font-mono text-[#79747e]"
									>{sliderIndex + 1} of {currentTabChars.length}</span
								>
							</div>
							<div class="h-1 overflow-hidden rounded-full bg-[#e7e0ec]">
								<div
									class="h-1 rounded-full bg-[#6750a4] transition-all duration-500"
									style="width: {progressPercent}%"
								></div>
							</div>
						</div>

						<!-- Brahmi Character -->
						{#key sliderIndex}
							<div
								class="font-brahmi mb-8 flex h-64 items-center justify-center text-[14rem] leading-none text-[#381e72]"
								in:fly={{ x: sliderDirection === 'right' ? 50 : -50, duration: 300 }}
							>
								{currentSliderChar.brahmi}
							</div>
						{/key}

						<!-- Info Row -->
						<div class="flex items-center justify-center gap-12 border-t border-[#e7e0ec] pt-8">
							<div class="text-center">
								<span class="mb-1 block text-xs tracking-widest text-[#79747e] uppercase"
									>Phonetic</span
								>
								<span class="text-3xl font-bold text-[#381e72]">{currentSliderChar.phonetic}</span>
							</div>
							<div class="h-12 w-px bg-[#cac4d0]"></div>
							<div class="text-center">
								<span class="mb-1 block text-xs tracking-widest text-[#79747e] uppercase"
									>Tamil</span
								>
								<span class="text-3xl font-bold text-[#14b8a6]">{currentSliderChar.tamil}</span>
							</div>
						</div>

						<!-- Previous / Next Buttons -->
						<div class="mt-8 flex items-center justify-center gap-6">
							<button
								onclick={prevSlider}
								disabled={sliderIndex === 0}
								aria-label="Previous character"
								title="Previous (Left Arrow)"
								class="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaddff] text-[#21005d] shadow-sm transition-all hover:bg-[#d0bcff] disabled:cursor-not-allowed disabled:opacity-30"
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
								aria-label="Next character"
								title="Next (Right Arrow)"
								class="flex h-12 w-12 items-center justify-center rounded-full bg-[#6750a4] text-white shadow-md transition-all hover:scale-105 hover:bg-[#7f67be] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
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

						<!-- Keyboard Shortcuts Hint -->
						<p class="mt-4 text-center text-xs text-[#79747e]">
							Use ← → arrows or 1, 2, 3 to switch tabs. Press Esc to exit.
						</p>
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
										class="mb-6 w-full text-center text-lg font-bold tracking-widest text-[#49454f] uppercase"
									>
										{section.name}
										<span class="ml-2 text-xs font-normal text-[#79747e]">({section.subtitle})</span
										>
									</h2>
									<div
										class="mx-auto grid max-w-[1200px] grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6"
									>
										{#each section.chars as char}
											<div
												class="alphabet-card font-brahmi flex h-56 w-full flex-col items-center justify-center rounded-xl border border-[#e7e0ec] bg-[#f3edf7] p-4 text-center shadow-[0_4px_12px_rgba(103,80,164,0.1)] transition-all hover:border-[#6750a4] hover:shadow-[0_4px_12px_rgba(103,80,164,0.15)]"
											>
												<div class="font-brahmi mb-6 text-[3.5rem] leading-none text-[#381e72]">
													{char.brahmi}
												</div>
												<div
													class="flex flex-col items-center gap-2 border-t border-[#e7e0ec] pt-3"
												>
													<span class="text-4xl font-bold text-[#14b8a6]">{char.tamil}</span>
													<span class="text-xl text-[#49454f]">{char.phonetic}</span>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<h2
							class="mt-12 mb-8 text-center text-lg font-bold tracking-[0.3em] text-[#49454f] uppercase"
						>
							{activeTab === 'vowels' ? 'THE 12 HOLY VOWELS' : 'SPECIAL CHARACTERS'}
						</h2>
						<div
							class="mx-auto grid w-full max-w-[1200px] grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6"
						>
							{#each currentTabChars as char}
								<div
									class="alphabet-card font-brahmi flex h-56 w-full flex-col items-center justify-center rounded-xl border border-[#e7e0ec] bg-[#f3edf7] p-4 text-center shadow-[0_4px_12px_rgba(103,80,164,0.1)] transition-all hover:border-[#6750a4] hover:shadow-[0_4px_12px_rgba(103,80,164,0.15)]"
								>
									<div class="mb-6 text-[3.5rem] leading-none text-[#381e72]">
										{char.brahmi}
									</div>
									<div class="flex flex-col items-center gap-2 border-t border-[#e7e0ec] pt-3">
										<span class="text-4xl font-bold text-[#14b8a6]">{char.tamil}</span>
										<span class="text-xl text-[#49454f]">{char.phonetic}</span>
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
			class="mx-auto max-w-md rounded-2xl border border-[#e7e0ec] bg-[#f3edf7] p-8 shadow-lg"
		>
			<div class="mb-4 flex justify-between text-sm tracking-widest text-[#49454f] uppercase">
				<span>Challenge Mode</span>
				<span>Score: {score}</span>
			</div>
			<h3 class="mb-1 text-center text-[#49454f]">Find the character for:</h3>
			<div class="mb-6 text-center text-6xl font-black text-[#6750a4] uppercase">
				{challengeTarget.phonetic}
			</div>
			<p class="mb-8 h-6 text-center text-[#6750a4]">{challengeFeedback}</p>
			<div class="mx-auto grid grid-cols-5 gap-3">
				{#each ALPHABET_ARRAY as char}
					<button
						onclick={() => checkChallenge(char)}
						class="font-brahmi flex aspect-square items-center justify-center rounded-lg border border-[#e7e0ec] bg-[#f3edf7] text-2xl text-[#6750a4] shadow-sm transition-all hover:bg-[#e8def8] active:scale-95"
					>
						{char.brahmi}
					</button>
				{/each}
			</div>
		</section>
	{:else if mode === 'word'}
		<section class="mx-auto max-w-xl text-center">
			<div
				class="mb-8 rounded-2xl border border-[#e7e0ec] bg-[#f3edf7] p-8 shadow-lg {showSuccess
					? 'border-[#6750a4]'
					: ''} transition-all"
			>
				<span class="text-sm font-semibold tracking-widest text-[#14b8a6] uppercase"
					>Modern Tamil</span
				>
				<div
					class="mb-2 text-6xl font-bold text-[#1c1b1f] uppercase transition-transform {showSuccess
						? 'scale-110'
						: ''}"
				>
					{currentWord.tamil}
				</div>
				<p class="mb-6 text-[#79747e] italic">{currentWord.english}</p>

				<div class="mb-4 flex justify-center gap-2">
					{#if showHint && hintInfo}
						<div class="rounded-lg bg-[#ffd8e4] px-4 py-2 text-sm text-[#7d5260]">
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
								? 'border-[#6750a4] bg-[#e8def8] text-[#6750a4]'
								: showHint && i === userSequence.length
									? 'animate-pulse border-[#ffd8e4] bg-[#ffd8e4] text-[#7d5260]'
									: 'border-[#e7e0ec] bg-white text-transparent'}"
						>
							{userSequence[i] || ''}
						</div>
					{/each}
				</div>

				<p class="mb-4 text-sm font-medium {showSuccess ? 'text-[#6750a4]' : 'text-[#14b8a6]'}">
					{wordFeedback}
				</p>

				<div class="mb-6 flex justify-center gap-3">
					<button
						onclick={toggleHint}
						disabled={showSuccess || userSequence.length === currentWordBrahmi.length}
						class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {showHint
							? 'bg-[#7d5260] text-white'
							: 'bg-[#ffd8e4] text-[#7d5260] hover:bg-[#f9d8d8]'} disabled:opacity-50"
					>
						{showHint ? 'Hide Hint' : 'Show Hint'}
					</button>
				</div>

				<div class="grid grid-cols-7 gap-2">
					{#each ALPHABET_ARRAY as char, idx}
						<button
							onclick={() => handleWordInput(char.brahmi)}
							disabled={showSuccess}
							class="flex aspect-square items-center justify-center rounded text-xl transition-all hover:bg-[#e8def8] disabled:opacity-50 {hintHighlightIndex ===
							idx
								? 'bg-[#ffd8e4] ring-2 ring-[#6750a4]'
								: 'bg-[#f3edf7] hover:bg-[#e8def8]'}"
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
