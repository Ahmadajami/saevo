<script lang="ts">
	import { setLocale, getLocale } from '$lib/paraglide/runtime';
	import { Button } from '$lib/components/ui/button';
	import LanguagesIcon from '@lucide/svelte/icons/languages';
	import { cn } from '$lib/utils';

	let { class: className, ...restProps } = $props<{ class?: string }>();

	const currentLocale = $derived(getLocale());
	const targetLocale = $derived(currentLocale === 'en' ? 'ar' : 'en');
	const label = $derived(currentLocale === 'en' ? 'العربية' : 'English');
	const dir = $derived(currentLocale === 'ar' ? 'rtl' : 'ltr');

	function toggleLanguage() {
		setLocale(targetLocale);
	}
</script>

<Button
	variant="ghost"
	size="sm"
	onclick={toggleLanguage}
	class={cn('flex items-center gap-2 px-3', className)}
	{dir}
	{...restProps}
>
	<LanguagesIcon data-icon="inline-start" />
	<span class="font-medium text-xs tracking-wide">{label}</span>
</Button>
