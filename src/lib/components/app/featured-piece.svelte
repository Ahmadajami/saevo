<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Piece = {
		id: string;
		title: string;
		desc?: string;
		img: string;
		cols: string;
		heightClass?: string;
	};

	let { piece, class: className, ...restProps }: { piece: Piece } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={['piece-card relative overflow-hidden group rounded-none', className]} {...restProps}>
	<img src={piece.img} alt={piece.title} class={['w-full object-cover', piece.heightClass || 'h-85']} />
	<div class="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent"></div>
	<div class="card-label absolute bottom-6 left-6">
		<p class="font-sans text-[10px] tracking-[0.3em] text-primary uppercase">{piece.title}</p>
		{#if piece.desc}
			<p class="font-body italic text-muted-foreground text-sm mt-1">{piece.desc}</p>
		{/if}
	</div>
</div>

<style>
	.piece-card img {
		transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), filter 1.4s ease;
		filter: grayscale(35%) brightness(0.85);
	}
	.piece-card:hover img {
		transform: scale(1.045);
		filter: grayscale(0%) brightness(1);
	}
	.piece-card .card-label {
		transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
	}
</style>
