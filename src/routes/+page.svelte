<script lang="ts">
	let { data } = $props();
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
	<!-- Hero Section -->
	<section class="container mx-auto px-4 py-16 text-center">
		<h1 class="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6">
			Discover Ancient Inscriptions
		</h1>
		<p class="mt-3 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 prose">
			Explore a rich collection of historical inscriptions, categorized by their unique scripts and valuable content.
			Delve into the past and uncover stories etched in stone and metal.
		</p>
	</section>

	<!-- Inscriptions Grid Section -->
	<section class="container mx-auto px-4 py-12">
		<h2 class="text-4xl font-bold text-center mb-12">Our Collection</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each data.inscriptions as inscription (inscription.id)}
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
					<h3 class="text-2xl font-semibold mb-3">{inscription.name}</h3>
					<p class="text-gray-700 dark:text-gray-300 mb-4 prose">
						{inscription.content}
					</p>
					<div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
						<span>Script: {inscription.scriptType}</span>
						<!-- In a real app, this would link to a detail page like `/inscriptions/${inscription.id}` -->
						<a href="#" class="text-blue-600 hover:underline dark:text-blue-400">View Details</a>
					</div>
				</div>
			{:else}
				<p class="col-span-full text-center text-gray-600 dark:text-gray-400">No inscriptions found.</p>
			{/each}
		</div>
	</section>
</div>
