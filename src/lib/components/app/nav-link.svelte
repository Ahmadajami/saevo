<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils';

	let { href = '#', children, class: className, ...restProps }: { href?: string; children?: Snippet } & HTMLAnchorAttributes = $props();
</script>

<a
	href={resolve(href as Pathname)}
	class={cn('nav-link transition-colors duration-300', className)}
	{...restProps}
>
	{@render children?.()}
</a>

<style>
	.nav-link {
		position: relative;
		padding-bottom: 6px;
	}
	.nav-link::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 0%;
		height: 1px;
		background: linear-gradient(90deg, var(--color-gold), var(--color-gold-bright));
		transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.nav-link:hover::after {
		width: 100%;
	}
</style>
