<script lang="ts">
	import * as RadioGroup from '$lib/components/ui/radio-group';
	
	let { 
		colors, 
		value = $bindable(), 
		...restProps 
	}: { 
		colors: { name: string; hex: string }[];
		value: string;
	} = $props();
</script>

<RadioGroup.Root bind:value class="flex flex-row gap-4 w-auto" {...restProps}>
	{#each colors as color (color.name)}
		<div class="relative flex items-center justify-center">
			<RadioGroup.Item
				value={color.name}
				id="color-{color.name}"
				class="relative w-10 h-10 size-10 rounded-full border border-border/80 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-none shrink-0 flex items-center justify-center bg-transparent cursor-pointer [&_[data-slot=radio-group-indicator]]:hidden data-[state=checked]:ring-1 data-[state=checked]:ring-primary data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background"
				style="background-color: {color.hex};"
				aria-label={color.name}
			/>
		</div>
	{/each}
</RadioGroup.Root>
