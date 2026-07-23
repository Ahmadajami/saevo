<script lang="ts">
	import ProductCard from '$lib/components/app/product-card.svelte';
	import * as UnderlineTabs from '$lib/components/ui/underline-tabs';
	import * as Select from '$lib/components/ui/select/index.js';

	// Mock products list
	const products = [
		{
			id: 'obsidian-enigma',
			name: 'The Obsidian Enigma',
			category: 'Art',
			price: '$4,200',
			numericPrice: 4200,
			image: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop',
			hoverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop'
		},
		{
			id: 'ivory-balance',
			name: 'Ivory Balance Vase',
			category: 'Sculptures',
			price: '$1,850',
			numericPrice: 1850,
			image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=2070&auto=format&fit=crop',
			hoverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop'
		},
		{
			id: 'gilded-horizon',
			name: 'Gilded Horizon Light',
			category: 'Furniture',
			price: '$3,100',
			numericPrice: 3100,
			image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=2069&auto=format&fit=crop',
			hoverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop'
		},
		{
			id: 'charcoal-monolith',
			name: 'Charcoal Monolith Table',
			category: 'Furniture',
			price: '$6,800',
			numericPrice: 6800,
			image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=2070&auto=format&fit=crop',
			hoverImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=2070&auto=format&fit=crop'
		}
	];

	// Filter state
	let selectedCategory = $state('All');
	let sortBy = $state('default');

	const categories = ['All', 'Sculptures', 'Furniture', 'Art'];

	const sortOptions = [
		{ value: 'default', label: 'Featured' },
		{ value: 'low-high', label: 'Price: Low to High' },
		{ value: 'high-low', label: 'Price: High to Low' }
	];

	let triggerContent = $derived(
		sortOptions.find((o) => o.value === sortBy)?.label ?? 'Featured'
	);

	// Reactive filtered and sorted list
	let displayProducts = $derived.by(() => {
		let list = [...products];

		// Apply Category Filter
		if (selectedCategory !== 'All') {
			list = list.filter(p => p.category === selectedCategory);
		}

		// Apply Sort
		if (sortBy === 'low-high') {
			list.sort((a, b) => a.numericPrice - b.numericPrice);
		} else if (sortBy === 'high-low') {
			list.sort((a, b) => b.numericPrice - a.numericPrice);
		}

		return list;
	});
</script>

<div class="min-h-screen bg-background text-foreground px-8 lg:px-24 py-16 lg:py-24">
	<!-- Page Header -->
	<header class="max-w-xl mb-16 lg:mb-24 animate-in fade-in slide-in-from-bottom-6 duration-1000">
		<span class="font-sans text-xs uppercase tracking-[0.25em] text-primary mb-3 block font-semibold">Saevo Collection</span>
		<h1 class="font-heading text-4xl lg:text-6xl mb-6 font-light tracking-tight">
			The Curated Pieces
		</h1>
		<p class="font-sans text-muted-foreground text-base leading-relaxed">
			A singular collection where quiet minimalism meets raw material expression. Each piece is crafted in limited numbers, highlighting contrast, geometry, and texture.
		</p>
	</header>

	<!-- Filter & Sort Bar -->
	<section aria-label="Catalog filters and sorting" class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 mb-12 border-b border-border/40 animate-in fade-in duration-1000 delay-200 fill-mode-both">
		<!-- Category Selector -->
		<UnderlineTabs.Root bind:value={selectedCategory}>
			<UnderlineTabs.List>
				{#each categories as category (category)}
					<UnderlineTabs.Trigger value={category}>
						{category}
					</UnderlineTabs.Trigger>
				{/each}
			</UnderlineTabs.List>
		</UnderlineTabs.Root>

		<!-- Sort Selector -->
		<div class="flex items-center space-x-3">
			<span id="sort-label" class="font-sans text-xs uppercase tracking-widest text-muted-foreground">Sort By:</span>
			<Select.Root type="single" bind:value={sortBy} >
				<Select.Trigger class="w-45 bg-transparent border-none font-sans text-xs uppercase tracking-widest text-foreground focus:ring-0 cursor-pointer p-0 h-auto gap-1">
					{triggerContent}
				</Select.Trigger>
				<Select.Content class="rounded-none bg-card text-foreground border border-border">
					{#each sortOptions as option (option.value)}
						<Select.Item value={option.value} label={option.label} class="font-sans text-xs uppercase tracking-widest cursor-pointer rounded-none">
							{option.label}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</section>

	<!-- Product Grid -->
	{#if displayProducts.length > 0}
		<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
			{#each displayProducts as product, index (product.id)}
				<li style="animation-delay: {index * 100}ms" class="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
					<ProductCard {product} />
				</li>
			{/each}
		</ul>
	{:else}
		<section aria-live="polite" class="py-24 text-center border border-dashed border-border/40 animate-in fade-in duration-500">
			<h2 class="font-heading text-xl text-muted-foreground mb-2">No pieces found</h2>
			<p class="font-sans text-sm text-muted-foreground/60">Try choosing a different collection category.</p>
		</section>
	{/if}
</div>
