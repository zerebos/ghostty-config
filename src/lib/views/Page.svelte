<script lang="ts">
    export let title = "Ghostty Configurator";

    import History from "$lib/components/History.svelte";
    import { writable } from "svelte/store";

    let isScrolling = writable(false);
    let bufferHeight = writable(53);
    // let paddingHeight = writable(0);
    
    function containerScroll(event: Event) {
        isScrolling.set((event.target as HTMLDivElement).scrollTop > 0);
        const scrollerPos = (event.target as HTMLDivElement).scrollTop;
        if (scrollerPos >= 53) {
            bufferHeight.set(0);
            // paddingHeight.set(53);
        }
        else {
            bufferHeight.set(53 - scrollerPos);
            // paddingHeight.set(scrollerPos);
        }
    }
</script>

<div class="content-page">
    <div class="content-header" class:scrolling={$isScrolling}>
        <History /><h1>{title}</h1>
    </div>
    <!-- <div class="content-buffer" style="min-height: {$bufferHeight}px"></div> -->
    <div class="content-container" style="margin-top: {$bufferHeight}px" on:scroll={containerScroll}>
        <slot></slot>
    </div>
</div>


<style>
.content-page {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
}

.content-header {
    display: flex;
    align-items: center;
    /* font-weight: 700; */
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
}

/* .content-buffer {
    display: flex;
} */

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
    padding: 0 20px 10px 20px;
    /* padding-top: 60px; */
}
</style>