<script lang="ts">
	import AnimatedThemeToggler from '$lib/components/magic/animated-theme-toggler/animated-theme-toggler.svelte';
	import { cn } from '$lib/utils';

	let { class: className, ...restProps } = $props<{ class?: string }>();
</script>

<AnimatedThemeToggler
	class={cn(
		'inline-flex h-9 w-9 items-center justify-center rounded-none text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
		className
	)}
	{...restProps}
/>
