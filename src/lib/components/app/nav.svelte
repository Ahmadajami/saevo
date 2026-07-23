<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import NavLink from './nav-link.svelte';
	import LanguageToggle from './language-toggle.svelte';
	import ThemeToggle from './theme-toggle.svelte';

	let scrollY = $state(0);
	let lastScrollY = 0;
	let isHidden = $state(false);

	$effect(() => {
		// Track scroll direction to show/hide navbar
		if (scrollY > lastScrollY && scrollY > 80) {
			isHidden = true;
		} else {
			isHidden = false;
		}
		lastScrollY = scrollY;
	});
</script>

<svelte:window bind:scrollY />

<nav class={['fixed top-0 left-0 w-full z-50 glass-nav border-b border-white/5 bg-char/60 backdrop-blur-md text-ivory transition-transform duration-300 ease-in-out', isHidden ? '-translate-y-full' : 'translate-y-0']}>
	<div class="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between relative">
		<div class="hidden md:flex gap-10 font-sans text-[10px] tracking-[0.3em] text-ivory/80 uppercase">
			<NavLink href="/#collections">{m.nav_collections()}</NavLink>
			<NavLink href="/#atelier">{m.nav_atelier()}</NavLink>
		</div>

		<a href={resolve('/#')} class="absolute left-1/2 -translate-x-1/2 font-display tracked-lg text-xl md:text-2xl text-gold-bright select-none hover:text-ivory mr-[-0.5em]">
			S&nbsp;A&nbsp;E&nbsp;V&nbsp;O
		</a>

		<div class="hidden md:flex items-center gap-10 font-sans text-[10px] tracking-[0.3em] text-ivory/80 uppercase">
			<NavLink href="/#campaign">{m.nav_campaign()}</NavLink>
			<NavLink href="/#vip">{m.nav_vip()}</NavLink>
			
			<!-- Controls panel containing language and theme toggles -->
			<div class="flex items-center gap-2 border-l border-white/10 pl-6 h-5">
				<LanguageToggle class="text-ivory hover:text-gold-bright hover:bg-white/5 transition-colors p-1" />
				<ThemeToggle class="text-ivory hover:text-gold-bright hover:bg-white/5 transition-colors p-1" />
			</div>
		</div>

		<!-- mobile fallback -->
		<div class="md:hidden font-sans text-[10px] tracking-[0.3em] text-ivory/60 uppercase">{m.nav_menu()}</div>
	</div>
</nav>

<style>
	.font-display {
		font-family: var(--font-sans);
	}
	.tracked-lg {
		letter-spacing: 0.5em;
	}
</style>
