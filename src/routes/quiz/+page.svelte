<script lang="ts">
	import { ALPHABET } from '$lib/scripts/alphabet';

	interface QuizQuestion {
		id: string;
		question: string;
		options: { brahmi: string; tamil: string }[];
		correctIndex: number;
	}

	type Difficulty = 'easy' | 'medium' | 'hard';

	const allChars = Object.values(ALPHABET).filter((c) => c.type !== 'Special');

	function generateQuiz(difficulty: Difficulty, count: number): QuizQuestion[] {
		const questions: QuizQuestion[] = [];
		const usedChars = new Set<string>();
		const optionCount = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;

		for (let i = 0; i < count; i++) {
			let randomChar;
			do {
				randomChar = allChars[Math.floor(Math.random() * allChars.length)];
			} while (usedChars.has(randomChar.brahmi));
			usedChars.add(randomChar.brahmi);

			const options: QuizQuestion['options'] = [
				{ brahmi: randomChar.brahmi, tamil: randomChar.tamil }
			];

			while (options.length < optionCount) {
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

	let difficulty = $state<Difficulty>('medium');
	let questions = $state<QuizQuestion[]>(generateQuiz(difficulty, 5));
	let currentQuestion = $state(0);
	let selectedAnswer = $state<number | null>(null);
	let showResult = $state(false);
	let score = $state(0);
	let quizComplete = $state(false);
	let timeLeft = $state(30);
	let timerInterval: ReturnType<typeof setInterval> | null = null;
	let gameStarted = $state(false);

	function startTimer() {
		stopTimer();
		timeLeft = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 30 : 15;
		timerInterval = setInterval(() => {
			timeLeft--;
			if (timeLeft <= 0) {
				stopTimer();
				quizComplete = true;
			}
		}, 1000);
	}

	function stopTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function startQuiz() {
		questions = generateQuiz(difficulty, 5);
		currentQuestion = 0;
		selectedAnswer = null;
		showResult = false;
		score = 0;
		quizComplete = false;
		gameStarted = true;
		startTimer();
	}

	function selectAnswer(index: number) {
		if (showResult) return;
		selectedAnswer = index;
		showResult = true;

		if (index === questions[currentQuestion].correctIndex) {
			score++;
		}

		stopTimer();
		setTimeout(() => {
			if (currentQuestion < questions.length - 1) {
				currentQuestion++;
				selectedAnswer = null;
				showResult = false;
				startTimer();
			} else {
				quizComplete = true;
			}
		}, 1500);
	}

	function restartQuiz() {
		gameStarted = false;
		stopTimer();
		questions = generateQuiz(difficulty, 5);
		currentQuestion = 0;
		selectedAnswer = null;
		showResult = false;
		score = 0;
		quizComplete = false;
		timeLeft = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 30 : 15;
	}

	function setDifficulty(level: Difficulty) {
		difficulty = level;
		if (!gameStarted) {
			questions = generateQuiz(difficulty, 5);
		}
	}

	const currentQ = $derived(questions[currentQuestion]);
	const progressPercent = $derived(
		(timeLeft / (difficulty === 'easy' ? 60 : difficulty === 'medium' ? 30 : 15)) * 100
	);
</script>

<div
	class="flex min-h-screen flex-col items-center bg-[#fef7ff] px-4 py-12 font-sans text-[#1c1b1f]"
>
	<div class="mx-auto w-full max-w-2xl">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="font-cinzel mb-2 text-3xl font-bold tracking-wider text-[#1c1b1f]">QUIZ MODE</h1>
			<p class="text-sm text-[#49454f]">Match the Brahmi character to its phonetic sound</p>
		</div>

		{#if !gameStarted}
			<!-- Difficulty Selection -->
			<div class="mb-8 text-center">
				<p class="mb-4 text-sm text-[#49454f]">Select Difficulty</p>
				<div class="flex justify-center gap-3">
					<button
						onclick={() => setDifficulty('easy')}
						class="rounded-xl border px-6 py-3 text-sm font-medium transition-all {difficulty ===
						'easy'
							? 'border-[#6750a4] bg-[#e8def8] text-[#6750a4]'
							: 'border-[#79747e] bg-[#f3edf7] text-[#49454f] hover:bg-[#e8def8]'}"
					>
						🟢 Easy
						<span class="ml-2 text-xs opacity-60">(60s, 2 options)</span>
					</button>
					<button
						onclick={() => setDifficulty('medium')}
						class="rounded-xl border px-6 py-3 text-sm font-medium transition-all {difficulty ===
						'medium'
							? 'border-[#6750a4] bg-[#e8def8] text-[#6750a4]'
							: 'border-[#79747e] bg-[#f3edf7] text-[#49454f] hover:bg-[#e8def8]'}"
					>
						🟡 Medium
						<span class="ml-2 text-xs opacity-60">(30s, 3 options)</span>
					</button>
					<button
						onclick={() => setDifficulty('hard')}
						class="rounded-xl border px-6 py-3 text-sm font-medium transition-all {difficulty ===
						'hard'
							? 'border-[#6750a4] bg-[#e8def8] text-[#6750a4]'
							: 'border-[#79747e] bg-[#f3edf7] text-[#49454f] hover:bg-[#e8def8]'}"
					>
						🔴 Hard
						<span class="ml-2 text-xs opacity-60">(15s, 4 options)</span>
					</button>
				</div>
			</div>

			<!-- Start Button -->
			<div class="flex justify-center">
				<button
					onclick={startQuiz}
					class="rounded-xl bg-[#6750a4] px-12 py-4 text-lg font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-[#7f67be]"
				>
					Start Quiz
				</button>
			</div>
		{:else if !quizComplete}
			<!-- Timer & Progress -->
			<div class="mb-6 flex items-center justify-between">
				<div class="flex items-center gap-4">
					<!-- Timer -->
					<div class="flex items-center gap-2">
						<svg
							class="h-5 w-5 text-[#49454f]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span
							class="font-mono text-lg font-bold {timeLeft <= 10
								? 'animate-pulse text-[#b3261e]'
								: 'text-[#1c1b1f]'}"
						>
							{formatTime(timeLeft)}
						</span>
					</div>
				</div>
				<span class="text-sm text-[#49454f]">
					Question {currentQuestion + 1} of {questions.length}
				</span>
			</div>

			<!-- Timer Bar -->
			<div class="mb-6 h-2 overflow-hidden rounded-full bg-[#e7e0ec]">
				<div
					class="h-full rounded-full transition-all duration-1000 {timeLeft <= 10
						? 'bg-[#b3261e]'
						: 'bg-[#6750a4]'}"
					style="width: {progressPercent}%"
				></div>
			</div>

			<!-- Score -->
			<div class="mb-6 text-center">
				<span class="text-sm text-[#49454f]">Score: </span>
				<span class="font-mono text-lg font-bold text-[#7d5260]">{score}</span>
			</div>

			<!-- Question Card -->
			<div class="rounded-3xl border border-[#e7e0ec] bg-[#f3edf7] p-8 text-center shadow-lg">
				<p class="mb-2 text-sm tracking-widest text-[#49454f] uppercase">
					What Brahmi character sounds like:
				</p>
				<p class="mb-8 text-5xl font-bold text-[#6750a4]">{currentQ.question}</p>

				<!-- Options -->
				<div class="grid grid-cols-2 gap-4">
					{#each currentQ.options as option, idx}
						<button
							onclick={() => selectAnswer(idx)}
							disabled={showResult}
							class="flex h-24 flex-col items-center justify-center rounded-xl border-2 p-4 text-3xl font-bold transition-all
								{showResult
								? idx === currentQ.correctIndex
									? 'border-[#6750a4] bg-[#e8def8] text-[#6750a4]'
									: idx === selectedAnswer
										? 'border-[#b3261e] bg-[#f9d8d8] text-[#b3261e]'
										: 'border-[#e7e0ec] bg-[#f3edf7] text-[#79747e]'
								: 'border-[#e7e0ec] bg-[#f3edf7] text-[#6750a4] hover:border-[#6750a4] hover:bg-[#e8def8]'}"
						>
							<span class="text-4xl">{option.brahmi}</span>
							<span class="mt-1 text-xs text-[#79747e]">{option.tamil}</span>
						</button>
					{/each}
				</div>

				{#if showResult}
					<p
						class="mt-6 text-lg font-medium {selectedAnswer === currentQ.correctIndex
							? 'text-[#6750a4]'
							: 'text-[#b3261e]'}"
					>
						{selectedAnswer === currentQ.correctIndex ? '✨ Correct!' : '❌ Incorrect!'}
					</p>
				{/if}
			</div>
		{:else}
			<!-- Quiz Complete -->
			<div
				class="rounded-3xl border border-[#6750a4]/30 bg-gradient-to-br from-[#f3edf7] to-[#e8def8] p-12 text-center shadow-lg"
			>
				<div class="mb-4 text-6xl">
					{score === questions.length ? '🏆' : score >= questions.length / 2 ? '👏' : '💪'}
				</div>
				<h2 class="mb-2 text-3xl font-bold text-[#1c1b1f]">Quiz Complete!</h2>
				<p class="mb-6 text-lg text-[#49454f]">
					You scored <span class="font-bold text-[#6750a4]">{score}</span> out of
					<span class="font-bold">{questions.length}</span>
				</p>
				<p class="mb-8 text-sm text-[#79747e]">
					{score === questions.length
						? 'Perfect score! Excellent work!'
						: score >= questions.length / 2
							? 'Good job! Keep practicing!'
							: "Keep learning! You'll get better!"}
				</p>
				<div class="flex justify-center gap-4">
					<button
						onclick={() => setDifficulty(difficulty)}
						class="rounded-xl bg-[#6750a4] px-8 py-3 font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-[#7f67be]"
					>
						Try Again
					</button>
					<button
						onclick={restartQuiz}
						class="rounded-xl border border-[#79747e] bg-[#f3edf7] px-8 py-3 font-bold text-[#49454f] transition-all hover:bg-[#e8def8]"
					>
						Change Difficulty
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.font-cinzel {
		font-family: 'Cinzel', serif;
	}
</style>
