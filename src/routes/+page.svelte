<script lang="ts">
	import SimpleImageViewer from '$lib/SimpleImageViewer.svelte';
	import type { ApiResponse, ScreenshotListResponse, FolderImagesResponse } from '$types/api';

	let folders = $state<string[]>([]);
	let selectedFolder = $state<string | null>(null);
	let images = $state<string[]>([]);
	let error = $state<string | null>(null);

	const isEmpty = $derived(folders.length === 0);
	const hasImages = $derived(images.length > 0);

	let viewerOpen = $state(false);
	let currentImageIndex = $state(0);

	function openViewer(index: number) {
		currentImageIndex = index;
		viewerOpen = true;
	}

	$effect(() => {
		console.log('Fetching folders from /api/screenshots/list');
		fetch('/api/screenshots/list')
			.then(async (res) => {
				const { success, data, error }: ApiResponse<ScreenshotListResponse> = await res.json();
				if (success) folders = data?.folders ?? [];
				else throw new Error(error);
			})
			.catch((err) => {
				error = err.message;
				console.error('Error fetching folders:', err);
			});
	});

	async function loadImages(folder: string) {
		selectedFolder = folder;
		try {
			const res = await fetch(`/api/screenshots/${folder}`);
			const { success, data, error }: ApiResponse<FolderImagesResponse> = await res.json();
			if (success) images = data?.images ?? [];
			else throw new Error(error);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load images';
			images = [];
		}
	}

	let isCapturing = $state(false);
	let captureStatus = $state<string | null>(null);

	async function startCapture() {
		isCapturing = true;
		captureStatus = null;
		try {
			const response = await fetch('/api/screenshots/capture', { method: 'POST' });
			const result = await response.json();
			if (result.success) {
				captureStatus = `Captured ${result.data.count} screenshots to ${result.data.folder}`;
				loadImages(result.data.folder);
			} else {
				captureStatus = `Capture failed: ${result.error}`;
			}
		} catch (err) {
			captureStatus = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
		} finally {
			isCapturing = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50 p-6">
	<h1 class="mb-8 text-3xl font-bold text-gray-900">
		Surf Spot Screenshots
		<span class="text-sm text-gray-500">(Cotso)</span>
	</h1>

	{#if error}
		<div class="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
			{error}
		</div>
	{/if}

	<section class="mb-8">
		<button
			onclick={startCapture}
			disabled={isCapturing}
			class="rounded-lg bg-surf-500 px-4 py-2 text-white hover:bg-surf-600"
		>
			{#if isCapturing}
				Capturing...
			{:else}
				New Session Capture
			{/if}
		</button>

		{#if captureStatus}
			<div class="mt-2 text-sm text-gray-600">
				{captureStatus}
			</div>
		{/if}
	</section>

	<section class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-gray-800">
			{isEmpty ? 'No screenshot folders found' : 'Select Session'}
		</h2>

		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each folders as folder}
				<button
					onclick={() => loadImages(folder)}
					class:bg-indigo-600={folder === selectedFolder}
					class="rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm"
				>
					<div class="font-medium text-gray-900">{folder}</div>
				</button>
			{/each}
		</div>
	</section>

	{#if selectedFolder}
		<section>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold text-gray-800">
					{hasImages ? `${images.length} Screenshots` : 'No images found'}
				</h2>
				<button onclick={() => (selectedFolder = null)} class="text-gray-500 hover:text-gray-700">
					Clear Selection
				</button>
			</div>

			<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{#each images as image, i}
					<button
						onclick={() => openViewer(i)}
						class="group relative block overflow-hidden rounded-lg bg-gray-100 transition-all hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2"
					>
						<img
							src={`/${selectedFolder}/${image}`}
							alt={`Surf conditions screenshot - ${image}`}
							loading="lazy"
							class="h-48 w-full object-cover transition-transform group-hover:scale-105"
						/>
						<div
							class="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<span class="truncate text-sm text-white">{image}</span>
						</div>
					</button>
				{/each}
			</div>
		</section>
	{/if}
</div>

{#if viewerOpen}
	<SimpleImageViewer
		bind:initialIndex={currentImageIndex}
		images={images.map((img) => `/${selectedFolder}/${img}`)}
		close={() => (viewerOpen = false)}
	/>
{/if}
