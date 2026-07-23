<script lang="ts">
	import { setLocale, getLocale, locales, type Locale } from '$lib/paraglide/runtime';
	import { Button } from '$lib/components/ui/button';
	import LanguagesIcon from '@lucide/svelte/icons/languages';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { cn } from '$lib/utils';

	let { class: className } = $props<{ class?: string }>();

	let isOpen = $state(false);

	const currentLocale = $derived(getLocale());
	const languageNames: Record<string, string> = {
		en: 'English',
		ar: 'العربية'
	};

	function selectLocale(locale: Locale) {
		setLocale(locale);
		isOpen = false;
	}

	function handleOutsideClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.lang-switcher-container')) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleOutsideClick} />

<div class="relative inline-block text-left lang-switcher-container">
	<Button
		variant="ghost"
		size="icon"
		class={cn('h-9 w-9 text-foreground hover:bg-accent hover:text-accent-foreground rounded-none', className)}
		onclick={() => isOpen = !isOpen}
		aria-haspopup="true"
		aria-expanded={isOpen}
	>
		<LanguagesIcon class="h-4 w-4" />
		<span class="sr-only">Switch language</span>
	</Button>

	{#if isOpen}
		<div class="absolute right-0 mt-2 w-32 origin-top-right rounded-none bg-card border border-border shadow-lg focus:outline-none z-50">
			<div class="py-1">
				{#each locales as locale, idx (idx)}
					<button
						type="button"
						onclick={() => selectLocale(locale)}
						class="flex items-center justify-between w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-left rounded-none"
					>
						<span>{languageNames[locale] || locale}</span>
						{#if locale === currentLocale}
							<CheckIcon class="h-4 w-4 text-primary" />
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
