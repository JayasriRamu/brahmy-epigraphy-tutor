<script lang="ts">
	import { ALPHABET } from '$lib/scripts/alphabet';
	import { tamilToBrahmi } from '$lib/scripts/convert';

	interface Card {
		id: string;
		type: 'brahmi' | 'phoneme';
		value: string;
		brahmiChar: string;
		matched: boolean;
	}

	let { data }: { data: { inscription?: { content: string; name: string } } } = $props();

	const brahmiSequence = $derived(
		data?.inscription?.content ? tamilToBrahmi(data.inscription.content) : []
	);

	const uniqueBrahmi = $derived([...new Set(brahmiSequence)]);

	function buildCards(): Card[] {
		const result: Card[] = [];
		const phonemes = new Map<string, string>();

		for (const brahmi of uniqueBrahmi) {
			const entry = Object.values(ALPHABET).find((c) => c.brahmi === brahmi);
			if (entry) {
				phonemes.set(brahmi, entry.phonetic);
			}
		}

		for (const [brahmi, phoneme] of phonemes) {
			result.push({
				id: `brahmi-${brahmi}`,
				type: 'brahmi',
				value: brahmi,
				brahmiChar: brahmi,
				matched: false
			});
			result.push({
				id: `phoneme-${brahmi}`,
				type: 'phoneme',
				value: phoneme,
				brahmiChar: brahmi,
				matched: false
			});
		}

		return result;
	}

	let gameCards = $state<Card[]>([]);

	$effect(() => {
		gameCards = [...buildCards()].sort(() => Math.random() - 0.5);
	});

	function getCard(id: string): Card | undefined {
		return gameCards.find((c) => c.id === id);
	}

	let selectedBrahmi = $state<Card | null>(null);
	let selectedPhoneme = $state<Card | null>(null);
	let feedback = $state('');
	let matches = $state(0);
	let attempts = $state(0);

	function selectCard(card: Card) {
		if (card.matched) return;
		if (selectedBrahmi && selectedPhoneme) return;

		feedback = '';

		if (card.type === 'brahmi') {
			if (selectedBrahmi?.id === card.id) {
				selectedBrahmi = null;
			} else {
				selectedBrahmi = card;
			}
		} else {
			if (selectedPhoneme?.id === card.id) {
				selectedPhoneme = null;
			} else {
				selectedPhoneme = card;
			}
		}

		if (selectedBrahmi && selectedPhoneme) {
			attempts++;
			if (selectedBrahmi.brahmiChar === selectedPhoneme.brahmiChar) {
				feedback = 'Correct!';
				matches++;
				gameCards = gameCards.map((c) =>
					c.id === selectedBrahmi!.id || c.id === selectedPhoneme!.id ? { ...c, matched: true } : c
				);
				selectedBrahmi = null;
				selectedPhoneme = null;
			} else {
				feedback = 'Try again!';
				setTimeout(() => {
					selectedBrahmi = null;
					selectedPhoneme = null;
				}, 800);
			}
		}
	}

	function isSelected(card: Card) {
		return (selectedBrahmi?.id === card.id || selectedPhoneme?.id === card.id) && !card.matched;
	}

	function resetGame() {
		selectedBrahmi = null;
		selectedPhoneme = null;
		feedback = '';
		matches = 0;
		attempts = 0;
		gameCards = [...buildCards()].sort(() => Math.random() - 0.5);
	}
</script>

<svelte:head>
	<style>
		body {
			margin: 0;
		}
	</style>
</svelte:head>

<div class="min-h-screen w-full bg-slate-950 p-8">
	<div class="mx-auto max-w-4xl">
		<header class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-bold text-blue-400">Brahmi Matching Game</h1>
			{#if data?.inscription?.name}
				<p class="text-slate-400">From: {data.inscription.name}</p>
			{/if}
		</header>

		<div class="mb-6 flex items-center justify-between text-slate-300">
			<div class="text-lg">
				Matches: <span class="font-bold text-green-400">{matches}</span> / {uniqueBrahmi.length}
			</div>
			<div class="text-lg">
				Attempts: <span class="font-bold text-yellow-400">{attempts}</span>
			</div>
			<button
				onclick={resetGame}
				class="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
			>
				Reset
			</button>
		</div>

		{#if feedback}
			<div
				class="mb-6 text-center text-2xl font-bold {feedback === 'Correct!'
					? 'text-green-400'
					: 'text-red-400'}"
			>
				{feedback}
			</div>
		{/if}

		{#if matches === uniqueBrahmi.length && uniqueBrahmi.length > 0}
			<div class="mb-8 rounded-2xl bg-green-900/50 p-8 text-center">
				<h2 class="mb-2 text-3xl font-bold text-green-400">Congratulations!</h2>
				<p class="text-slate-300">You matched all {uniqueBrahmi.length} pairs!</p>
				<button
					onclick={resetGame}
					class="mt-4 rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-500"
				>
					Play Again
				</button>
			</div>
		{/if}

		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
			{#each gameCards as card}
				<button
					onclick={() => selectCard(card)}
					class="flex h-20 items-center justify-center rounded-xl text-3xl font-bold transition-all
					{card.matched
						? 'bg-green-900/50 text-green-400 opacity-50'
						: isSelected(card)
							? card.type === 'brahmi'
								? 'bg-blue-600 text-white ring-2 ring-blue-400'
								: 'bg-purple-600 text-white ring-2 ring-purple-400'
							: 'bg-slate-800 text-white hover:bg-slate-700'}"
				>
					{card.value}
				</button>
			{/each}
		</div>

		<div class="mt-8 flex justify-center gap-8 text-slate-400">
			<div class="flex items-center gap-2">
				<div class="h-4 w-4 rounded bg-blue-600"></div>
				<span>Brahmi</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="h-4 w-4 rounded bg-purple-600"></div>
				<span>Phoneme</span>
			</div>
		</div>

		<div class="mt-8 text-center">
			<a href="/" class="text-blue-400 hover:underline">Back to Home</a>
		</div>
	</div>
</div>
