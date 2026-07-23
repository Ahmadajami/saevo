<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { BlurFade } from '$lib/components/magic/blur-fade';
	import FeaturedPiece from '$lib/components/app/featured-piece.svelte';
	import GoldButton from '$lib/components/app/gold-button.svelte';

	let pieces = $derived([
		{
			id: 'obsidian-coat',
			title: m.piece_obsidian_coat_title(),
			desc: m.piece_obsidian_coat_desc(),
			img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1400&auto=format&fit=crop',
			cols: 'md:col-span-4 md:row-span-2',
			heightClass: 'h-[520px] md:h-[720px]',
			delay: 0.1
		},
		{
			id: 'cufflinks',
			title: m.piece_cufflinks_title(),
			img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
			cols: 'md:col-span-2',
			heightClass: 'h-[340px]',
			delay: 0.2
		},
		{
			id: 'gown',
			title: m.piece_gown_title(),
			img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
			cols: 'md:col-span-2',
			heightClass: 'h-[340px]',
			delay: 0.3
		},
		{
			id: 'campaign',
			title: m.piece_campaign_title(),
			desc: m.piece_campaign_desc(),
			img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1800&auto=format&fit=crop',
			cols: 'md:col-span-6',
			heightClass: 'h-[420px]',
			delay: 0.2
		}
	]);
</script>

<section id="hero" class="relative w-full h-screen overflow-hidden bg-background flex flex-col items-center justify-center">
	<!-- Ambient gold lights & vignette effect -->
	<div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(ellipse at center, transparent 35%, var(--background) 100%);"></div>

	<div class="relative z-10 flex flex-col items-center text-center px-6">
		<BlurFade delay={0.1} direction="down">
			<p class="font-sans text-[10px] tracking-[0.3em] text-primary/80 uppercase mb-6">
				{m.hero_subtitle()}
			</p>
		</BlurFade>
		<BlurFade delay={0.2} direction="down">
			<h1 class="font-heading text-4xl sm:text-5xl md:text-7xl text-foreground tracking-wide leading-tight animate-fade-in">
				{m.hero_title_part_1()} <br class="hidden md:block"> {m.hero_title_part_2()}
			</h1>
		</BlurFade>
		<BlurFade delay={0.3} direction="down">
			<p class="font-body italic text-lg md:text-xl text-muted-foreground mt-6 max-w-md">
				{m.hero_description()}
			</p>
		</BlurFade>
		<BlurFade delay={0.4} direction="down">
			<GoldButton class="mt-10">
				{m.hero_cta()}
			</GoldButton>
		</BlurFade>
	</div>

	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 font-sans text-[9px] tracking-[0.3em] text-muted-foreground/50 uppercase">
		Scroll
	</div>
</section>

<!-- ================= INTRO STRIP ================= -->
<section class="py-28 md:py-36 px-6 bg-background border-b border-border/30">
	<div class="max-w-3xl mx-auto text-center">
		<BlurFade direction="up">
			<p class="font-body text-xl md:text-2xl leading-relaxed text-foreground/80">
				{m.intro_text()}
			</p>
			<div class="hairline w-24 mx-auto mt-10"></div>
		</BlurFade>
	</div>
</section>

<!-- ================= FEATURED PIECES ================= -->
<section id="collections" class="px-6 md:px-10 py-28 md:py-36 bg-background">
	<div class="max-w-7xl mx-auto">
		<div class="flex items-end justify-between mb-14">
			<BlurFade direction="right" class="flex flex-col gap-2">
				<h2 class="font-heading text-3xl md:text-4xl text-foreground tracking-wide">{m.collections_title()}</h2>
			</BlurFade>
			<BlurFade direction="left">
				<span class="font-sans text-[10px] tracking-[0.3em] text-primary/70 uppercase hidden md:inline">{m.collections_subtitle()}</span>
			</BlurFade>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-8">
			{#each pieces as piece (piece.id)}
				<div class={piece.cols}>
					<BlurFade delay={piece.delay} direction="up">
						<FeaturedPiece {piece} />
					</BlurFade>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ================= ATELIER ================= -->
<section id="atelier" class="relative py-28 md:py-36 px-6 bg-card border-y border-border/30">
	<div class="max-w-5xl mx-auto text-center">
		<BlurFade direction="up">
			<p class="font-sans text-[10px] tracking-[0.3em] text-primary/70 uppercase mb-6">{m.atelier_subtitle()}</p>
			<h3 class="font-heading text-3xl md:text-5xl text-foreground tracking-wide leading-snug">
				{m.atelier_title_part_1()} <br> {m.atelier_title_part_2()}
			</h3>
			<p class="font-body text-lg text-muted-foreground mt-8 max-w-2xl mx-auto leading-relaxed">
				{m.atelier_desc()}
			</p>
		</BlurFade>
	</div>
</section>

<!-- ================= CAMPAIGN / VIP CTA ================= -->
<section id="campaign" class="py-28 md:py-36 px-6 bg-background text-center">
	<div id="vip">
		<BlurFade direction="up">
			<p class="font-sans text-[10px] tracking-[0.3em] text-primary/70 uppercase mb-6">{m.vip_subtitle()}</p>
			<h3 class="font-heading text-3xl md:text-4xl text-foreground tracking-wide mb-8">{m.vip_title()}</h3>
			<GoldButton>
				{m.vip_cta()}
			</GoldButton>
		</BlurFade>
	</div>
</section>

<style>
	.hairline {
		background: linear-gradient(90deg, transparent, var(--border), transparent);
		height: 1px;
	}
</style>
