<script lang="ts">
    import {onNavigate} from "$app/navigation";
    import History from "$lib/components/History.svelte";
    import type {Snippet} from "svelte";


    interface Props {
        children: Snippet;
        title?: string;
    }

    let {children, title = "Ghostty Config"}: Props = $props();
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

    let scroller: HTMLDivElement;
    onNavigate(() => {scroller.scrollTop = 0;});
</script>

<div class="content-page">
    <div class="content-header" class:scrolling={isScrolling}>
        <History /><h1>{title}</h1>
    </div>
    <div class="content-container" bind:this={scroller} style="margin-top: {bufferHeight}px" onscroll={containerScroll}>
        {@render children()}
    </div>
</div>


<style>
.content-page {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    flex: 1;
}

.content-header {
    display: flex;
    align-items: center;
    font-size: 16pt;
    gap: 10px;
    padding: 10px 20px 5px 20px;
    background: rgba(44, 39, 51, 0.9);
    /* not top: #2E2932 */
    backdrop-filter: blur(20px);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
}

.content-header.scrolling {
    background: rgba(46, 41, 50, 0.9);
    border-bottom: 1px solid black;
}

.content-header h1 {
    font-size: 1.3rem;
    margin: 8px 0;
    font-weight: 600;
}

.content-container {
    overflow-y: auto;
    padding: 8px 20px 10px 20px;
    flex: 1;
}
</style>