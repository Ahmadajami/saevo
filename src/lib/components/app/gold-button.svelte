<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button, type ButtonProps } from '$lib/components/ui/button';

	let { children, class: className, ...restProps }: { children?: Snippet } & ButtonProps = $props();
</script>

<Button class={['cta-gold px-10 py-3 font-sans text-[10px] tracking-[0.3em] text-gold uppercase transition-all duration-500 rounded-none bg-transparent hover:bg-transparent', className]} {...restProps}>
	{@render children?.()}
</Button>

<style>
	:global(.cta-gold) {
		position: relative !important;
		overflow: hidden !important;
		border: 1px solid var(--color-gold-line) !important;
		transition: color 0.5s ease, letter-spacing 0.5s ease !important;
		z-index: 0 !important;
	}
	:global(.cta-gold::before) {
		content: '' !important;
		position: absolute !important;
		inset: 0 !important;
		background: var(--color-gold) !important;
		transform: translateX(-101%) !important;
		transition: transform 0.55s cubic-bezier(0.65, 0, 0.35, 1) !important;
		z-index: -1 !important;
	}
	:global(.cta-gold:hover::before) {
		transform: translateX(0%) !important;
	}
	:global(.cta-gold:hover) {
		color: var(--color-obsidian) !important;
	}
</style>
