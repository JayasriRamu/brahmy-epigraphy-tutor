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
			}, 600);
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

<div class="flex min-h-screen flex-col items-center bg-[#0f172a] px-4 py-12">
	<!-- Match Flash Effect -->
	{#if showFlash}
		<div class="pointer-events-none fixed inset-0 z-40" transition:fly={{ duration: 400 }}>
			<div
				class="bg-gradient-radial animate-flash absolute inset-0 from-emerald-500/20 via-transparent to-transparent"
			></div>
		</div>
	{/if}

	<div class="mx-auto w-full max-w-4xl">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="font-cinzel mb-2 text-3xl font-bold tracking-wider text-white">
				TWO-COLUMN MATCH
			</h1>
			<p class="text-sm text-slate-400">Match Tamil to Brahmi characters</p>
		</div>

		<!-- Progress & Controls -->
		<div class="mb-8 flex flex-col items-center gap-4">
			<!-- HUD Capsule -->
			<div
				class="flex items-center gap-6 rounded-full border border-white/10 bg-white/5 px-6 py-3 shadow-xl backdrop-blur-md"
			>
				<!-- Circular Progress -->
				<div class="relative h-12 w-12">
					<svg class="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
						<circle
							cx="24"
							cy="24"
							r="20"
							fill="none"
							stroke="rgba(255,255,255,0.1)"
							stroke-width="3"
						/>
						<circle
							cx="24"
							cy="24"
							r="20"
							fill="none"
							stroke="url(#progressGradient)"
							stroke-width="3"
							stroke-linecap="round"
							stroke-dasharray={2 * Math.PI * 20}
							stroke-dashoffset={2 * Math.PI * 20 * (1 - progressPercent / 100)}
							class="transition-all duration-500"
						/>
					</svg>
					<div class="absolute inset-0 flex items-center justify-center">
						<span class="text-xs font-bold text-emerald-400">{matchedIds.length}</span>
					</div>
				</div>

				<!-- Divider -->
				<div class="h-8 w-px bg-white/20"></div>

				<!-- Matched -->
				<div class="flex items-center gap-2">
					<span class="text-sm text-slate-400">Matched</span>
					<span class="font-mono text-lg font-bold text-emerald-400">{matchedIds.length}/6</span>
				</div>

				<!-- Divider -->
				<div class="h-8 w-px bg-white/20"></div>

				<!-- Attempts -->
				<div class="flex items-center gap-2">
					<span class="text-sm text-slate-400">Attempts</span>
					<span class="font-mono text-lg font-bold text-amber-400">{attempts}</span>
				</div>
			</div>

			<!-- Hint Button -->
			<button
				onclick={toggleHint}
				class="rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm text-slate-400 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
			>
				{showHint ? 'Hide Hints' : 'Show Hints'}
			</button>
		</div>

		<!-- Game Board -->
		<div class="grid grid-cols-2 gap-8">
			<!-- Column A: Tamil -->
			<div class="space-y-4">
				<h2
					class="font-cinzel mb-4 text-center text-sm font-semibold tracking-widest text-emerald-400 uppercase"
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
								class="flex h-36 w-full flex-col items-center justify-center rounded-2xl border border-t border-r border-b border-l border-black/40 border-white/20 bg-slate-800/40 shadow-xl backdrop-blur-md transition-all duration-300
									{isMatched
									? 'scale-100 cursor-default border-emerald-500 bg-emerald-500/20 opacity-40 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
									: isWrong
										? 'animate-shake border-red-500/50 bg-red-500/20'
										: isSelected
											? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3),inset_0_0_15px_rgba(16,185,129,0.2)]'
											: 'hover:-translate-y-1 hover:border-white/30 hover:bg-white/10'}
									{isJustMatched ? 'animate-pop' : ''}"
							>
								<span class="text-6xl font-bold text-emerald-400">{pair.tamil}</span>
								{#if showHintText}
									<span class="mt-2 text-xs text-slate-500">{pair.phonetic}</span>
								{/if}
							</button>
							{#if isJustMatched}
								<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
									<div class="h-2 w-2 animate-ping rounded-full bg-emerald-400"></div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Column B: Brahmi -->
			<div class="space-y-4">
				<h2
					class="font-cinzel mb-4 text-center text-sm font-semibold tracking-widest text-slate-300 uppercase"
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
								class="flex h-36 w-full flex-col items-center justify-center rounded-2xl border border-t border-r border-b border-l border-black/40 border-white/20 bg-slate-800/40 shadow-xl backdrop-blur-md transition-all duration-300
									{isMatched
									? 'scale-100 cursor-default border-emerald-500 bg-emerald-500/20 opacity-40 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
									: isWrong
										? 'animate-shake border-red-500/50 bg-red-500/20'
										: isSelected
											? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
											: 'hover:-translate-y-1 hover:border-white/30 hover:bg-white/10'}
									{isJustMatched ? 'animate-pop' : ''}"
							>
								<span class="text-6xl font-bold text-white">{pair.brahmi}</span>
								{#if showHintText}
									<span class="mt-2 text-xs text-slate-500">{pair.phonetic}</span>
								{/if}
							</button>
							{#if isJustMatched}
								<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
									<div class="h-2 w-2 animate-ping rounded-full bg-emerald-400"></div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Instructions -->
		<p class="mt-8 text-center text-sm text-slate-500">
			Select a Tamil tile, then match it with the correct Brahmi tile
		</p>
	</div>

	<!-- Win Modal -->
	{#if showWin}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div
				class="animate-bounce-in rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600/90 to-emerald-800/90 p-10 text-center shadow-2xl backdrop-blur-xl"
			>
				<div class="mb-4 text-6xl">🎉</div>
				<h2 class="mb-2 text-3xl font-bold text-white">Perfect Match!</h2>
				<p class="mb-6 text-emerald-100">All 6 pairs matched in {attempts} attempts!</p>
				<button
					onclick={nextSet}
					class="rounded-xl bg-white/20 px-8 py-3 text-lg font-semibold text-white transition-all hover:scale-105 hover:bg-white/30"
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
