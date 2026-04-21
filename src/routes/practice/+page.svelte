<script lang="ts">
	import { ALPHABET } from '$lib/scripts/alphabet';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	interface MatchPair {
		id: string;
		tamil: string;
		brahmi: string;
		phonetic: string;
	}

	const allChars = Object.values(ALPHABET).filter((c) => c.type !== 'Special');

	function getRandomPairs(count: number): MatchPair[] {
		const shuffled = [...allChars].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, count).map((c) => ({
			id: c.tamil,
			tamil: c.tamil,
			brahmi: c.brahmi,
			phonetic: c.phonetic
		}));
	}

	function shuffleArray<T>(array: T[]): T[] {
		const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	let audioContext: AudioContext | null = null;

	function playDing() {
		if (!soundEnabled) return;
		if (!audioContext) {
			audioContext = new AudioContext();
		}
		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(1760, audioContext.currentTime + 0.1);

		gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

		oscillator.start(audioContext.currentTime);
		oscillator.stop(audioContext.currentTime + 0.3);
	}

	function playThud() {
		if (!soundEnabled) return;
		if (!audioContext) {
			audioContext = new AudioContext();
		}
		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.2);

		gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

		oscillator.start(audioContext.currentTime);
		oscillator.stop(audioContext.currentTime + 0.2);
	}

	let pairs: MatchPair[] = $state([]);
	let shuffledBrahmi: MatchPair[] = $state([]);
	let selectedTamilId: string | null = $state(null);
	let selectedBrahmiId: string | null = $state(null);
	let matchedIds: string[] = $state([]);
	let wrongTamilIds: string[] = $state([]);
	let wrongBrahmiIds: string[] = $state([]);
	let attempts = $state(0);
	let showWin = $state(false);
	let showHint = $state(false);
	let wrongCount = $state(0);
	let showFlash = $state(false);
	let flashId = $state('');
	let soundEnabled = $state(true);

	function initGame() {
		pairs = getRandomPairs(6);
		shuffledBrahmi = shuffleArray([...pairs]);
		selectedTamilId = null;
		selectedBrahmiId = null;
		matchedIds = [];
		wrongTamilIds = [];
		wrongBrahmiIds = [];
		attempts = 0;
		showWin = false;
		showHint = false;
		wrongCount = 0;
		showFlash = false;
		flashId = '';
	}

	function selectTamil(pair: MatchPair) {
		if (matchedIds.includes(pair.id)) return;
		wrongTamilIds = [];
		selectedTamilId = pair.id;

		if (selectedBrahmiId) {
			checkMatch();
		}
	}

	function selectBrahmi(pair: MatchPair) {
		if (matchedIds.includes(pair.id)) return;
		wrongBrahmiIds = [];
		selectedBrahmiId = pair.id;

		if (selectedTamilId) {
			checkMatch();
		}
	}

	function checkMatch() {
		if (!selectedTamilId || !selectedBrahmiId) return;

		attempts++;

		if (selectedTamilId === selectedBrahmiId) {
			playDing();
			matchedIds = [...matchedIds, selectedTamilId];
			selectedTamilId = null;
			selectedBrahmiId = null;
			wrongCount = 0;
			showFlash = true;
			flashId = matchedIds.length > 0 ? matchedIds[matchedIds.length - 1] : '';

			if (matchedIds.length === 6) {
				showWin = true;
			}
		} else {
			playThud();
			wrongCount++;
			wrongTamilIds = [selectedTamilId];
			wrongBrahmiIds = [selectedBrahmiId];
			setTimeout(() => {
				wrongTamilIds = [];
				wrongBrahmiIds = [];
				selectedTamilId = null;
				selectedBrahmiId = null;
			}, 500);
		}
	}

	function nextSet() {
		initGame();
	}

	function toggleHint() {
		showHint = !showHint;
	}

	onMount(() => {
		initGame();
	});

	const progressPercent = $derived((matchedIds.length / 6) * 100);
	const showHints = $derived(showHint || wrongCount >= 2);
</script>

<div
	class="flex min-h-screen flex-col items-center bg-[#fef7ff] px-4 py-12 font-sans text-[#1c1b1f]"
>
	<!-- Match Flash Effect -->
	{#if showFlash}
		<div class="pointer-events-none fixed inset-0 z-40" transition:fly={{ duration: 400 }}>
			<div
				class="bg-gradient-radial animate-flash absolute inset-0 from-[#ffd8e4] via-transparent to-transparent"
			></div>
		</div>
	{/if}

	<div class="mx-auto w-full max-w-4xl">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="font-cinzel mb-2 text-3xl font-bold tracking-wider text-[#1c1b1f]">
				TWO-COLUMN MATCH
			</h1>
			<p class="text-sm text-[#49454f]">Match Tamil to Brahmi characters</p>
		</div>

		<!-- Progress & Controls -->
		<div class="mb-8 flex flex-col items-center gap-4">
			<!-- Circular Badges -->
			<div class="flex items-center gap-4">
				<!-- Progress Badge -->
				<div
					class="relative flex h-16 w-16 flex-col items-center justify-center rounded-full border border-[#e7e0ec] bg-[#f3edf7] shadow-sm"
				>
					<svg class="absolute h-16 w-16 -rotate-90" viewBox="0 0 64 64">
						<circle cx="32" cy="32" r="28" fill="none" stroke="#e7e0ec" stroke-width="3" />
						<circle
							cx="32"
							cy="32"
							r="28"
							fill="none"
							stroke="#6750a4"
							stroke-width="3"
							stroke-linecap="round"
							stroke-dasharray={2 * Math.PI * 28}
							stroke-dashoffset={2 * Math.PI * 28 * (1 - progressPercent / 100)}
							class="transition-all duration-500"
						/>
					</svg>
					<span class="text-lg font-bold text-[#6750a4]">{matchedIds.length}</span>
				</div>

				<!-- Matched Badge -->
				<div
					class="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-[#e8def8] shadow-sm"
				>
					<span class="text-xs text-[#49454f]">Matched</span>
					<span class="text-lg font-bold text-[#6750a4]">{matchedIds.length}/6</span>
				</div>

				<!-- Attempts Badge -->
				<div
					class="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-[#ffd8e4] shadow-sm"
				>
					<span class="text-xs text-[#7d5260]">Attempts</span>
					<span class="text-lg font-bold text-[#7d5260]">{attempts}</span>
				</div>
			</div>

			<!-- Control Buttons -->
			<div class="flex items-center gap-3">
				<!-- Hint Button -->
				<button
					onclick={toggleHint}
					class="rounded-full border border-[#79747e] px-4 py-1 text-sm text-[#6750a4] transition-all hover:bg-[#6750a4]/5"
				>
					{showHint ? '🔤 Hide Hints' : '💡 Show Hints'}
				</button>

				<!-- Sound Toggle -->
				<button
					onclick={() => (soundEnabled = !soundEnabled)}
					aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
					title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
					class="rounded-full border border-[#79747e] px-4 py-1 text-sm transition-all hover:bg-[#6750a4]/5 {soundEnabled
						? 'text-[#6750a4]'
						: 'text-[#79747e]'}"
				>
					{soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
				</button>
			</div>
		</div>

		<!-- Game Board -->
		<div class="grid grid-cols-2 gap-8">
			<!-- Column A: Tamil -->
			<div class="space-y-4">
				<h2
					class="font-cinzel mb-4 text-center text-sm font-semibold tracking-widest text-[#14b8a6] uppercase"
				>
					Tamil
				</h2>
				<div class="grid grid-cols-3 gap-4">
					{#each [...pairs].sort((a, b) => a.tamil.localeCompare(b.tamil)) as pair}
						{@const isMatched = matchedIds.includes(pair.id)}
						{@const isSelected = selectedTamilId === pair.id}
						{@const isWrong = wrongTamilIds.includes(pair.id)}
						{@const showHintText = showHints && !isMatched}
						{@const isJustMatched = showFlash && flashId === pair.id && isMatched}
						<div class="relative">
							<button
								onclick={() => selectTamil(pair)}
								disabled={isMatched}
								class="flex h-36 w-full flex-col items-center justify-center rounded-2xl border border-[#e7e0ec] bg-[#f3edf7] shadow-[0_4px_12px_rgba(103,80,164,0.1)] transition-all duration-300
									{isMatched
									? 'bg-[#d1e9cf] opacity-50'
									: isWrong
										? 'animate-shake border-[#ef4444]'
										: isSelected
											? 'animate-pulse bg-[#e8def8] ring-4 ring-[#6750a4]/30'
											: 'hover:-translate-y-1 hover:border-[#6750a4]/50 hover:shadow-[0_4px_12px_rgba(103,80,164,0.15)]'}
									{isJustMatched ? 'animate-pop' : ''}"
							>
								<span class="text-6xl font-bold text-[#14b8a6]">{pair.tamil}</span>
								{#if showHintText}
									<span class="mt-2 text-xs text-[#79747e]">{pair.phonetic}</span>
								{/if}
							</button>
							{#if isJustMatched}
								<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
									<svg
										class="h-10 w-10 animate-ping text-[#16a34a]"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											fill-rule="evenodd"
											d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Column B: Brahmi -->
			<div class="space-y-4">
				<h2
					class="font-cinzel mb-4 text-center text-sm font-semibold tracking-widest text-[#6750a4] uppercase"
				>
					Brahmi
				</h2>
				<div class="grid grid-cols-3 gap-4">
					{#each shuffledBrahmi as pair}
						{@const isMatched = matchedIds.includes(pair.id)}
						{@const isSelected = selectedBrahmiId === pair.id}
						{@const isWrong = wrongBrahmiIds.includes(pair.id)}
						{@const showHintText = showHints && !isMatched}
						{@const isJustMatched = showFlash && flashId === pair.id && isMatched}
						<div class="relative">
							<button
								onclick={() => selectBrahmi(pair)}
								disabled={isMatched}
								class="flex h-36 w-full flex-col items-center justify-center rounded-2xl border border-[#e7e0ec] bg-[#f3edf7] shadow-[0_4px_12px_rgba(103,80,164,0.1)] transition-all duration-300
									{isMatched
									? 'bg-[#d1e9cf] opacity-50'
									: isWrong
										? 'animate-shake border-[#ef4444]'
										: isSelected
											? 'animate-pulse bg-[#e8def8] ring-4 ring-[#6750a4]/30'
											: 'hover:-translate-y-1 hover:border-[#6750a4]/50 hover:shadow-[0_4px_12px_rgba(103,80,164,0.15)]'}
									{isJustMatched ? 'animate-pop' : ''}"
							>
								<span class="font-brahmi text-6xl font-bold text-[#6750a4]">{pair.brahmi}</span>
								{#if showHintText}
									<span class="mt-2 text-xs text-[#79747e]">{pair.phonetic}</span>
								{/if}
							</button>
							{#if isJustMatched}
								<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
									<svg
										class="h-10 w-10 animate-ping text-[#16a34a]"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											fill-rule="evenodd"
											d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Instructions -->
		<p class="mt-8 text-center text-sm text-[#79747e]">
			Select a Tamil tile, then match it with the correct Brahmi tile
		</p>
	</div>

	<!-- Win Modal -->
	{#if showWin}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
			<div
				class="animate-bounce-in rounded-3xl border border-[#6750a4]/30 bg-gradient-to-br from-[#f3edf7] to-[#e8def8] p-10 text-center shadow-2xl"
			>
				<div class="mb-4 text-6xl">🎉</div>
				<h2 class="mb-2 text-3xl font-bold text-[#1c1b1f]">Perfect Match!</h2>
				<p class="mb-6 text-[#49454f]">All 6 pairs matched in {attempts} attempts!</p>
				<button
					onclick={nextSet}
					class="rounded-xl bg-[#6750a4] px-8 py-3 text-lg font-semibold text-white transition-all hover:scale-105 hover:bg-[#7f67be]"
				>
					Next Set
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.font-cinzel {
		font-family: 'Cinzel', serif;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-8px);
		}
		40% {
			transform: translateX(8px);
		}
		60% {
			transform: translateX(-8px);
		}
		80% {
			transform: translateX(8px);
		}
	}

	.animate-shake {
		animation: shake 0.4s ease-in-out;
	}

	@keyframes bounce-in {
		0% {
			transform: scale(0.5);
			opacity: 0;
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.animate-bounce-in {
		animation: bounce-in 0.5s ease-out;
	}

	@keyframes pop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.15);
		}
		100% {
			transform: scale(1);
		}
	}

	.animate-pop {
		animation: pop 0.3s ease-out;
	}

	@keyframes flash {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	.animate-flash {
		animation: flash 0.5s ease-out forwards;
	}

	.bg-gradient-radial {
		background: radial-gradient(
			circle at center,
			var(--tw-gradient-from),
			var(--tw-gradient-via),
			var(--tw-gradient-to)
		);
	}
</style>
