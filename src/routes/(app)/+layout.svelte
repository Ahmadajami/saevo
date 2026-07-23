<script lang="ts">
	import type { LayoutProps } from './$types';
	import Nav from '$lib/components/app/nav.svelte';
	import Footer from '$lib/components/app/footer.svelte';

	let { children }: LayoutProps = $props();
</script>

<Nav />
{@render children()}
<Footer />
