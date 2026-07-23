<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import GoldButton from '$lib/components/app/gold-button.svelte';
	import * as NumberField from '$lib/components/ui/number-field';
	import ColorRadioGroup from '$lib/components/app/color-radio-group.svelte';

	let isDrawerOpen = $state(false);

	// Options state
	let selectedColor = $state('Obsidian Black');
	let selectedSize = $state('Standard');
	let quantity = $state(1);

	// Mock product data
	const product = {
		name: 'The Obsidian Enigma',
		description:
			'A masterpiece of modern engineering and timeless design. The Obsidian Enigma features a sleek, unyielding silhouette cast in the deepest shadows, accented with a single gold line that catches the light like a secret promise. Crafted for those who understand that true luxury lies in restraint.',
		price: '$4,200',
		features: [
			'Forged in absolute silence',
			'Ivory inlaid detailing',
			'Weightless kinetic balance',
			'Hand-polished for 40 hours'
		],
		image:
			'https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop',
		colors: [
			{ name: 'Obsidian Black', hex: '#111111' },
			{ name: 'Brushed Titanium', hex: '#878681' }
		],
		sizes: ['Standard', 'Large']
	};
</script>

<div class="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
	<!-- A. The Immersive Hero -->
	<section
		class="relative flex h-[80vh] w-full items-center justify-center overflow-hidden md:h-screen"
	>
		<!-- Background Image -->
		<div class="absolute inset-0 z-0">
			<img
				src={product.image}
				alt={product.name}
				class="h-full w-full scale-100 object-cover opacity-80 transition-transform duration-[20s] ease-out hover:scale-110"
			/>
			<!-- Dark gradient overlay for text readability -->
			<div
				class="absolute inset-0 bg-linear-to-b from-background/60 via-background/20 to-background"
			></div>
		</div>

		<!-- Hero Content -->
		<div
			class="relative z-10 mx-auto flex max-w-5xl animate-in flex-col items-center px-6 text-center duration-1000 ease-out fade-in slide-in-from-bottom-12"
		>
			<h1
				class="mb-6 font-heading text-5xl tracking-tighter text-foreground uppercase drop-shadow-lg md:text-7xl lg:text-8xl"
			>
				{product.name}
			</h1>
			<p
				class="font-sans text-lg font-light tracking-widest text-foreground/90 uppercase md:text-2xl"
			>
				True luxury lies in restraint.
			</p>
		</div>

		<!-- Scroll Indicator -->
		<div
			class="absolute bottom-12 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center opacity-70"
		>
			<span class="mb-4 font-sans text-xs tracking-widest text-foreground uppercase">Discover</span>
			<div class="h-16 w-px bg-foreground/50"></div>
		</div>
	</section>

	<!-- B. The Narrative Flow -->
	<section class="mx-auto w-full max-w-6xl px-6 py-24 md:py-40">
		<div class="flex flex-col gap-32 md:gap-48">
			<!-- First Narrative Block -->
			<div class="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-24">
				<div
					class="order-2 mx-auto flex max-w-md flex-col justify-center space-y-8 md:order-1 md:mx-0"
				>
					<h2 class="font-heading text-3xl leading-tight md:text-5xl">
						A Masterpiece of Modern Engineering
					</h2>
					<p class="font-sans text-lg leading-relaxed font-light text-muted-foreground">
						The Obsidian Enigma features a sleek, unyielding silhouette cast in the deepest shadows,
						accented with a single gold line that catches the light like a secret promise.
					</p>
				</div>
				<div class="order-1 h-[60vh] w-full overflow-hidden bg-muted md:order-2 md:h-[80vh]">
					<img
						src={product.image}
						alt="The Obsidian Enigma Detail"
						class="h-full w-full object-cover transition-transform duration-[10s] hover:scale-105"
					/>
				</div>
			</div>

			<!-- Second Narrative Block (Reversed) -->
			<div class="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-24">
				<div class="h-[60vh] w-full overflow-hidden bg-muted md:h-[80vh]">
					<img
						src="https://images.unsplash.com/photo-1618022325802-7e5e732e9797?q=80&w=2000&auto=format&fit=crop"
						alt="Timeless Design"
						class="h-full w-full object-cover grayscale transition-all duration-[3s] hover:grayscale-0"
					/>
				</div>
				<div class="mx-auto flex max-w-md flex-col justify-center space-y-8 md:ml-auto">
					<h2 class="font-heading text-3xl leading-tight md:text-5xl">Timeless Design</h2>
					<p class="font-sans text-lg leading-relaxed font-light text-muted-foreground">
						Crafted for those who understand that perfection is achieved not when there is nothing
						more to add, but when there is nothing left to take away.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- C. The Details & Craftsmanship -->
	<section class="border-y border-border/50 bg-muted/30 py-24 md:py-40">
		<div class="mx-auto w-full max-w-5xl px-6">
			<div class="mb-24 flex flex-col items-center text-center">
				<h3 class="font-heading text-2xl tracking-widest text-foreground uppercase md:text-3xl">
					Craftsmanship
				</h3>
				<div class="mt-8 h-px w-16 bg-primary"></div>
			</div>

			<div class="grid grid-cols-1 gap-x-24 gap-y-16 md:grid-cols-2">
				{#each product.features as feature (feature)}
					<div class="group flex cursor-default flex-col">
						<Separator
							class="mb-8 bg-border/60 transition-colors duration-700 group-hover:bg-primary"
						/>
						<p class="font-sans text-xl font-light tracking-wide text-foreground/80 md:text-2xl">
							{feature}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- D. The Final Call to Action -->
	<section
		class="relative flex flex-col items-center justify-center overflow-hidden bg-background px-6 py-40 text-center md:py-64"
	>
		<!-- Subtle background decoration -->
		<div
			class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]"
		>
			<span class="font-heading text-[20vw] leading-none whitespace-nowrap">ENIGMA</span>
		</div>

		<div class="relative z-10 flex flex-col items-center">
			<h2 class="mb-6 font-heading text-4xl md:text-6xl">{product.name}</h2>
			<p
				class="mb-16 font-sans text-2xl font-light tracking-wide text-muted-foreground md:text-3xl"
			>
				{product.price}
			</p>

			<GoldButton
				class="px-16 py-8 text-lg"
				onclick={() => (isDrawerOpen = true)}
			>
				Acquire Now
			</GoldButton>
		</div>
	</section>

	<!-- Acquisition Drawer -->
	<Drawer.Root bind:open={isDrawerOpen}>
		<Drawer.Content>
			<div class="mx-auto w-full max-w-sm">
				<Drawer.Header>
					<Drawer.Title class="font-heading text-2xl tracking-tight">{product.name}</Drawer.Title>
					<Drawer.Description class="font-sans text-lg">{product.price}</Drawer.Description>
				</Drawer.Header>

				<div class="space-y-8 p-4 pb-0">
					<!-- Color Selection -->
					<div class="space-y-3">
						<span
							class="block font-heading text-sm tracking-widest text-muted-foreground uppercase"
						>
							Color
						</span>
						<ColorRadioGroup colors={product.colors} bind:value={selectedColor} />
						<p class="font-sans text-xs text-muted-foreground">{selectedColor}</p>
					</div>

					<!-- Size Selection -->
					<div class="space-y-3">
						<span
							class="block font-heading text-sm tracking-widest text-muted-foreground uppercase"
						>
							Size
						</span>
						<div class="flex gap-3">
							{#each product.sizes as size (size)}
								<button
									class="border px-6 py-2 font-sans text-sm transition-colors duration-300 {selectedSize ===
									size
										? 'border-primary text-primary'
										: 'border-border text-muted-foreground hover:border-primary/50'}"
									onclick={() => (selectedSize = size)}
								>
									{size}
								</button>
							{/each}
						</div>
					</div>

					<!-- Quantity -->
					<div class="space-y-3">
						<span
							class="block font-heading text-sm tracking-widest text-muted-foreground uppercase"
						>
							Quantity
						</span>
						<NumberField.Root bind:value={quantity} min={1}>
							<NumberField.Group class="w-32 border-border/80">
								<NumberField.Decrement class="hover:text-foreground text-muted-foreground" />
								<NumberField.Input class="w-full bg-transparent text-foreground text-center font-sans text-sm" />
								<NumberField.Increment class="hover:text-foreground text-muted-foreground" />
							</NumberField.Group>
						</NumberField.Root>
					</div>
				</div>

				<Drawer.Footer class="pt-8">
					<GoldButton class="w-full py-6" onclick={() => (isDrawerOpen = false)}>
						Add to Collection
					</GoldButton>
					<Drawer.Close
						class="w-full py-2 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						Cancel
					</Drawer.Close>
				</Drawer.Footer>
			</div>
		</Drawer.Content>
	</Drawer.Root>
</div>
