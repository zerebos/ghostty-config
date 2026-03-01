<script lang="ts">
    import {onNavigate} from "$app/navigation";
    import {fly} from "svelte/transition";
    import History from "$lib/components/History.svelte";
    import app from "$lib/stores/state.svelte";
    import type {Snippet} from "svelte";

    interface Props {
        children: Snippet;
        title?: string;
    }

    const {children, title = "Ghostty Config"}: Props = $props();

    $effect(() => {app.title = title;});

    let isScrolling = $state(false);
    let bufferHeight = $state(53);

    function containerScroll(event: Event) {
        isScrolling = (event.target as HTMLDivElement).scrollTop > 0;
        const scrollerPos = (event.target as HTMLDivElement).scrollTop;
        if (scrollerPos >= 53) {
            bufferHeight = 0;
        }
        else {
            bufferHeight = 53 - scrollerPos;
        }
    }

    let scroller: HTMLDivElement|undefined = $state();
    onNavigate(() => {
        isScrolling = false;
        bufferHeight = 53;
        if (scroller) scroller.scrollTop = 0;
    });
</script>



<div class="content-page">
    <div class="content-header" class:scrolling={isScrolling}>
        <History /><h1>{app.title}</h1>
    </div>
    {#key app.title}
    <div class="content-container" in:fly={{y: 30, duration: 200}} bind:this={scroller} style:margin-top="{bufferHeight}px" onscroll={containerScroll}>
        {@render children()}
    </div>
    {/key}
</div>


<style>
.content-page {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    /* position: relative; */
    flex: 1;
}

.content-header {
    display: flex;
    align-items: center;
    font-size: 16pt;
    gap: 10px;
    padding: 10px 20px 5px 20px;
    /* background: rgba(44, 39, 51, 0.9); */
    background: var(--bg-level-1);
    /* not top: #2E2932 */
    backdrop-filter: blur(20px);
    position: absolute;
    top: 0;
    left: var(--sidebar-width);
    right: 0;
    z-index: 1;
}

.content-header.scrolling {
    /* background: rgba(46, 41, 50, 0.9); */
    background: rgba(from var(--bg-level-1) r g b / 0.9);
    border-bottom: 1px solid black;
}

.content-header h1 {
    font-size: 1.3rem;
    margin: 8px 0;
    font-weight: 600;
}

.content-container {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 8px 20px 10px 20px;
    flex: 1;
}
</style>