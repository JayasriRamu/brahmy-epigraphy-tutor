<script lang="ts">
	import { ALPHABET } from '$lib/scripts/alphabet';

	interface QuizQuestion {
		id: string;
		question: string;
		options: { brahmi: string; tamil: string }[];
		correctIndex: number;
	}

	const allChars = Object.values(ALPHABET).filter((c) => c.type !== 'Special');

	function generateQuiz(): QuizQuestion[] {
		const questions: QuizQuestion[] = [];
		const usedChars = new Set<string>();

		for (let i = 0; i < 5; i++) {
			let randomChar;
			do {
				randomChar = allChars[Math.floor(Math.random() * allChars.length)];
			} while (usedChars.has(randomChar.brahmi));
			usedChars.add(randomChar.brahmi);

			const options: QuizQuestion['options'] = [
				{ brahmi: randomChar.brahmi, tamil: randomChar.tamil }
			];

			while (options.length < 4) {
				const wrongChar = allChars[Math.floor(Math.random() * allChars.length)];
				if (!options.some((o) => o.brahmi === wrongChar.brahmi)) {
					options.push({ brahmi: wrongChar.brahmi, tamil: wrongChar.tamil });
				}
			}

			options.sort(() => Math.random() - 0.5);

			questions.push({
				id: `q-${i}`,
				question: randomChar.phonetic,
				options,
				correctIndex: options.findIndex((o) => o.brahmi === randomChar.brahmi)
			});
		}

		return questions;
	}

	let questions = $state<QuizQuestion[]>(generateQuiz());
	let currentQuestion = $state(0);
	let selectedAnswer = $state<number | null>(null);
	let showResult = $state(false);
	let score = $state(0);
	let quizComplete = $state(false);

	function selectAnswer(index: number) {
		if (showResult) return;
		selectedAnswer = index;
		showResult = true;

		if (index === questions[currentQuestion].correctIndex) {
			score++;
		}

		setTimeout(() => {
			if (currentQuestion < questions.length - 1) {
				currentQuestion++;
				selectedAnswer = null;
				showResult = false;
			} else {
				quizComplete = true;
			}
		}, 1500);
	}

	function restartQuiz() {
		questions = generateQuiz();
		currentQuestion = 0;
		selectedAnswer = null;
		showResult = false;
		score = 0;
		quizComplete = false;
	}

	const currentQ = $derived(questions[currentQuestion]);
</script>

<div class="flex min-h-screen flex-col items-center bg-[#0f172a] px-4 py-12">
	<div class="mx-auto w-full max-w-2xl">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="font-cinzel mb-2 text-3xl font-bold tracking-wider text-white">QUIZ MODE</h1>
			<p class="text-sm text-slate-400">Match the Brahmi character to its phonetic sound</p>
		</div>

		{#if !quizComplete}
			<!-- Progress -->
			<div class="mb-8 flex items-center justify-between">
				<span class="text-sm text-slate-400"
					>Question {currentQuestion + 1} of {questions.length}</span
				>
				<span class="text-sm font-medium text-amber-400">Score: {score}</span>
			</div>

			<!-- Progress Bar -->
			<div class="mb-8 h-1 overflow-hidden rounded-full bg-white/10">
				<div
					class="h-full rounded-full bg-white transition-all duration-500"
					style="width: {((currentQuestion + 1) / questions.length) * 100}%"
				></div>
			</div>

			<!-- Question Card -->
			<div
				class="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-md"
			>
				<p class="mb-2 text-sm tracking-widest text-slate-400 uppercase">
					What Brahmi character sounds like:
				</p>
				<p class="mb-8 text-5xl font-bold text-white">{currentQ.question}</p>

				<!-- Options -->
				<div class="grid grid-cols-2 gap-4">
					{#each currentQ.options as option, idx}
						<button
							onclick={() => selectAnswer(idx)}
							disabled={showResult}
							class="flex h-24 flex-col items-center justify-center rounded-xl border-2 p-4 text-3xl font-bold transition-all
								{showResult
								? idx === currentQ.correctIndex
									? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
									: idx === selectedAnswer
										? 'border-red-500 bg-red-500/20 text-red-400'
										: 'border-white/10 bg-white/5 text-slate-400'
								: 'border-white/10 bg-white/5 text-white hover:border-white/30 hover:bg-white/10'}"
						>
							<span class="text-4xl">{option.brahmi}</span>
							<span class="mt-1 text-xs text-slate-400">{option.tamil}</span>
						</button>
					{/each}
				</div>

				{#if showResult}
					<p
						class="mt-6 text-lg font-medium {selectedAnswer === currentQ.correctIndex
							? 'text-emerald-400'
							: 'text-red-400'}"
					>
						{selectedAnswer === currentQ.correctIndex ? 'Correct!' : 'Incorrect!'}
					</p>
				{/if}
			</div>
		{:else}
			<!-- Quiz Complete -->
			<div
				class="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-12 text-center shadow-2xl backdrop-blur-md"
			>
				<div class="mb-4 text-6xl">🎉</div>
				<h2 class="mb-2 text-3xl font-bold text-white">Quiz Complete!</h2>
				<p class="mb-6 text-lg text-slate-300">
					You scored <span class="font-bold text-amber-400">{score}</span> out of
					<span class="font-bold">{questions.length}</span>
				</p>
				<button
					onclick={restartQuiz}
					class="rounded-xl bg-white px-8 py-3 font-bold text-slate-900 transition-all hover:scale-105"
				>
					Play Again
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.font-cinzel {
		font-family: 'Cinzel', serif;
	}
</style>
