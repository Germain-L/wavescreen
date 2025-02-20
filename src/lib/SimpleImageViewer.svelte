<script lang="ts">
    import { onMount } from 'svelte';
    // TODO: fix this shitty component

    // Get the props via $props() in Svelte 5 runes mode with initialIndex as bindable.
    // This lets the parent use: bind:initialIndex={...}
    let {
        images,
        initialIndex = $bindable(0),
        close
    } = $props<{
        images: string[];
        initialIndex?: number;
        close: () => void;
    }>();

    let panzoomInstance: any;
    let zoomableElement: HTMLDivElement | null = null;

    // Client-side: load Panzoom after mount with a synchronous cleanup return
    onMount(() => {
        let cleanup = () => {};
        import('@panzoom/panzoom').then(({ default: Panzoom }) => {
            if (zoomableElement) {
                panzoomInstance = Panzoom(zoomableElement, {
                    maxScale: 5,
                    minScale: 0.5,
                    // Try 'inside' or 'outside' to adjust containment
                    contain: 'inside'
                });
                resetView();
                cleanup = () => {
                    panzoomInstance?.destroy();
                };
            }
        });
        return cleanup;
    });

    // Function to reset zoom and pan
    const resetView = () => {
        panzoomInstance?.reset();
    };

    // Navigation functions
    const prevImage = () => {
        if (initialIndex > 0) {
            initialIndex--;
            resetView();
        }
    };

    const nextImage = () => {
        if (initialIndex < images.length - 1) {
            initialIndex++;
            resetView();
        }
    };
</script>

<div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
>
    <div
        bind:this={zoomableElement}
        class="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-black"
    >
        <img
            src={images[initialIndex]}
            alt="Surf conditions screenshot"
            class="h-full w-full object-contain"
            draggable="false"
        />
    </div>
    <button
        onclick={prevImage}
        class="absolute left-4 top-1/2 -translate-y-1/2 transform rounded bg-black/50 px-3 py-2 text-white hover:bg-black/75 disabled:opacity-50"
        disabled={initialIndex === 0}
    >
        ←
    </button>
    <button
        onclick={nextImage}
        class="absolute right-4 top-1/2 -translate-y-1/2 transform rounded bg-black/50 px-3 py-2 text-white hover:bg-black/75 disabled:opacity-50"
        disabled={initialIndex === images.length - 1}
    >
        →
    </button>
    <button
        onclick={close}
        class="absolute right-4 top-4 rounded bg-black/50 px-3 py-2 text-white hover:bg-black/75"
    >
        ✕
    </button>
    <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-4">
        <button
            onclick={() => panzoomInstance?.zoomOut()}
            class="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
            title="Zoom Out"
        >
            −
        </button>
        <button
            onclick={resetView}
            class="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
            title="Reset View"
        >
            Reset
        </button>
        <button
            onclick={() => panzoomInstance?.zoomIn()}
            class="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
            title="Zoom In"
        >
            +
        </button>
    </div>
    <div class="absolute bottom-4 right-4 rounded bg-black/50 px-3 py-1 text-white">
        {initialIndex + 1} / {images.length}
    </div>
</div>