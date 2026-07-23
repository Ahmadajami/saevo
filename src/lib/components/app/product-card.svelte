<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Card from '$lib/components/ui/card/index.js';

	interface Product {
		id: string;
		name: string;
		category: string;
		price: string;
		image: string;
		hoverImage: string;
	}

	let { product }: { product: Product } = $props();
	let isHovered = $state(false);
	let href = $derived(resolve('/product/[productId]', { productId: product.id }));
</script>

<a
	{href}
	class="group/card-link block text-foreground no-underline"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<Card.Root
		role="article"
		aria-label={product.name}
		class="rounded-none border border-border bg-card text-foreground transition-colors duration-500 [--card-spacing:--spacing(6)] group-hover/card-link:border-primary/50"
	>
		<!-- Image Container (Semantic figure) -->
		<figure class="relative m-0 aspect-3/4 w-full overflow-hidden bg-muted">
			<!-- Primary Image -->
			<img
				src={product.image}
				alt={product.name}
				class={[
					'ease-out-expo h-full w-full scale-100 object-cover transition-all duration-[1.5s] group-hover/card-link:scale-105',
					isHovered && product.hoverImage ? 'opacity-0' : 'opacity-100'
				]}
			/>

			<!-- Hover Image -->
			{#if product.hoverImage}
				<img
					src={product.hoverImage}
					alt={product.name}
					class={[
						'ease-out-expo absolute inset-0 h-full w-full scale-100 object-cover transition-all duration-[1.5s] group-hover/card-link:scale-105',
						isHovered ? 'opacity-100' : 'opacity-0'
					]}
				/>
			{/if}

			<!-- Action Label Overlay (Aria Hidden) -->
			<div
				aria-hidden="true"
				class="absolute right-0 bottom-0 left-0 flex translate-y-full items-center justify-between bg-linear-to-t from-background/90 to-transparent p-4 transition-transform duration-500 ease-out group-hover/card-link:translate-y-0"
			>
				<span class="font-sans text-xs font-medium tracking-widest text-primary uppercase">
					View Details
				</span>
				<span class="h-px w-4 bg-primary"></span>
			</div>
		</figure>

		<!-- Info Container -->
		<Card.Content class="flex grow flex-col justify-between pt-0 pb-6">
			<div>
				<span class="mb-2 block font-sans text-xs tracking-widest text-muted-foreground uppercase">
					{product.category}
				</span>
				<Card.Title
					role="heading"
					class="font-heading text-lg font-light tracking-tight text-foreground normal-case transition-colors duration-300 group-hover/card-link:text-primary lg:text-xl"
				>
					{product.name}
				</Card.Title>
			</div>
			<p class="mt-4 font-sans text-base font-medium tracking-tight text-foreground">
				{product.price}
			</p>
		</Card.Content>
	</Card.Root>
</a>

<style>
	.ease-out-expo {
		transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
	}
</style>
