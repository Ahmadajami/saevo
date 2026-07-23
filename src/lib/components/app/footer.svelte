<script lang="ts" module>
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
</script>

<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import NavLink from './nav-link.svelte';
	import LanguageSwitcher from './language-switcher.svelte';

	const socialLinks = [
		{ name: 'Instagram', href: '/#' },
		{ name: 'Weibo', href: '/#' },
		{ name: 'Wechat', href: '/#' }
	];
</script>

<footer class="rounded-none border-t border-border/30 bg-card px-6 pt-20 pb-10 md:px-10">
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-14 md:grid-cols-4 md:gap-8">
		<div>
			<p class="font-display tracked-lg mb-4 text-xl text-primary">S A E V O</p>
			<p class="font-body max-w-xs text-sm text-muted-foreground italic">
				{m.footer_desc()}
			</p>
		</div>

		<div>
			<p class="mb-5 font-sans text-[10px] tracking-[0.3em] text-primary/70 uppercase">
				{m.footer_correspondence()}
			</p>
			<form class="max-w-xs" onsubmit={(e) => e.preventDefault()}>
				<input
					type="email"
					placeholder={m.footer_email_placeholder()}
					class="underline-input font-body w-full rounded-none py-2 text-sm text-foreground/80 placeholder-muted-foreground/30"
				/>
				<button
					type="submit"
					class="mt-5 flex items-center gap-1 font-sans text-[10px] tracking-[0.3em] text-primary uppercase transition-colors duration-300 hover:text-foreground"
				>
					{m.footer_subscribe()}
					<ArrowRightIcon size={12} class="inline-block" />
				</button>
			</form>
		</div>

		<div class="md:text-center">
			<p class="mb-5 font-sans text-[10px] tracking-[0.3em] text-primary/70 uppercase">
				{m.footer_follow()}
			</p>
			<div
				class="flex gap-6 font-sans text-[10px] tracking-[0.3em] text-foreground/60 uppercase md:justify-center"
			>
				{#each socialLinks as link (link.name)}
					<NavLink href={link.href}>{link.name}</NavLink>
				{/each}
			</div>
		</div>

		<div class="md:text-right">
			<p class="mb-5 font-sans text-[10px] tracking-[0.3em] text-primary/70 uppercase">Language</p>
			<div class="flex md:justify-end">
				<LanguageSwitcher />
			</div>
		</div>
	</div>

	<div class="hairline mt-16 mb-8 w-full"></div>

	<p class="text-center font-sans text-[9px] tracking-[0.3em] text-muted-foreground/30 uppercase">
		{m.footer_rights()}
	</p>
</footer>

<style>
	.underline-input {
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--border);
		transition: border-color 0.4s ease;
	}
	.underline-input:focus {
		outline: none;
		border-color: var(--ring);
	}
	.hairline {
		background: linear-gradient(90deg, transparent, var(--border), transparent);
		height: 1px;
	}
	.font-display {
		font-family: var(--font-sans);
	}
	.tracked-lg {
		letter-spacing: 0.5em;
	}
</style>
