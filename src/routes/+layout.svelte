<script lang="ts">
    // import {onMount} from "svelte";
    import {page} from "$app/stores";
    import Gap from "$lib/components/Gap.svelte";
    import Tab from "$lib/components/Tab.svelte";
    import User from "$lib/components/User.svelte";
    import "../app.css";

    import application from "$lib/images/tabs/application.png";
    import clipboard from "$lib/images/tabs/clipboard.png";
    import window from "$lib/images/tabs/window.png";

    import colors from "$lib/images/tabs/colors.png";
    import fonts from "$lib/images/tabs/fonts.png";

    import keybinds from "$lib/images/tabs/keybinds.png";
    import mouse from "$lib/images/tabs/mouse.png";

    import gtk from "$lib/images/tabs/gtk.svg";
    import linux from "$lib/images/tabs/linux.png";
    import macos from "$lib/images/tabs/macos.png";

    let path;

    $: path = $page.url.pathname;
    // let left = "";
	// let top = "";
    // let mainWindow;

    // let moving = false;
	
	// function onMouseDown() {
	// 	moving = true;
	// }
	
	// function onMouseMove(e) {
	// 	if (moving) {
	// 		left += e.movementX;
	// 		top += e.movementY;
	// 	}
	// }
	
	// function onMouseUp() {
	// 	moving = false;
	// }

    // onMount(() => {
    //     const rect = mainWindow.getBoundingClientRect();
    //     left = rect.left;
    //     top = rect.top;
    //     console.log({left, top})
    // })
</script>

<!-- bind:this={mainWindow} style="left: {left}px; top: {top}px;" -->
<div class="app-window" >
    <!-- <div class="draggable" on:mousedown={onMouseDown}></div> -->
    <div id="sidebar">
        <div class="sidebar-header">
            <div class="window-actions-container">
                <div class="window-actions">
                    <button class="window-dot" style="background: rgb(242, 95, 88)"><span>×</span></button>
                    <button class="window-dot" style="background: rgb(251, 190, 60)"><span>-</span></button>
                    <button class="window-dot" style="background: rgb(88, 203, 66)"><span>+</span></button>
                </div>
            </div>
        </div>
        <nav id="categories">
            <User route="/" />
            <Gap />
            <Tab route="/settings/application">
                <img slot="icon" src={application} alt="Application Settings" />
                Application
            </Tab>
            <Tab route="/settings/clipboard">
                <img slot="icon" src={clipboard} alt="Clipboard Settings" />
                Clipboard
            </Tab>
            <Tab route="/settings/window">
                <img slot="icon" src={window} alt="Window Settings" />
                Window
            </Tab>
            <Gap />
            <Tab route="/settings/colors">
                <img slot="icon" src={colors} alt="Color Settings" />
                Colors
            </Tab>
            <Tab route="/settings/fonts">
                <img slot="icon" src={fonts} alt="Font Settings" />
                Fonts
            </Tab>
            <Gap />
            <Tab route="/settings/keybinds">
                <img slot="icon" src={keybinds} alt="Keybind Settings" />
                Keybinds
            </Tab>
            <Tab route="/settings/mouse">
                <img slot="icon" src={mouse} alt="Mouse Settings" />
                Mouse
            </Tab>
            <Gap />
            <Tab route="/settings/gtk">
                <div class="icon-wrapper" slot="icon"><img src={gtk} alt="GTK Settings" /></div>
                GTK
            </Tab>
            <Tab route="/settings/linux">
                <img slot="icon" src={linux} alt="Linux Settings" />
                Linux
            </Tab>
            <Tab route="/settings/macos">
                <img slot="icon" src={macos} alt="MacOS Settings" />
                macOS
            </Tab>
            <Gap />
            <Tab route="/scroll"><svg slot="icon" xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="#e8eaed"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>Scroll Test</Tab>
        </nav>
    </div>
    <div id="content-view">
        <slot></slot>
    </div>

</div>

<!-- <svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} /> -->

<style>
.app-window {
    user-select: none;
		/* cursor: move; */
    display: flex;
    position: relative;
    flex-direction: row;
    height: 100%;
    /* margin: 20px auto; */
    width: 90%;
    max-width: 715px;
    height: 700px;
    border: 1px solid black;
    /* box-shadow: 0 0 1px white inset; */
    box-shadow: 0 0 20px -1px rgba(0,0,0,0.7);
    border-radius: 15px;
    overflow: hidden;
}

/* .app-window .draggable {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    cursor: move;
    z-index: 10;
} */

.app-window::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: 0 0 1px white inset;
    border-radius: inherit;
    z-index: 2;
    pointer-events: none;
}

#sidebar {
    width: 215px;
    /* black: #272329; white: #544F57; */
    /* background: #272329; */
    /* background: rgba(62, 57, 64, 0.6); */
    /* background: rgba(39, 35, 41, 0.7); */
    background: rgba(50, 46, 52, 0.7);
    backdrop-filter: blur(10px);
    padding: 5px;
    border-right: 1px solid black;
    display: flex;
    flex-direction: column;
    
}

.sidebar-header {
    display: flex;
    flex-direction: column;
}

.sidebar-header .window-actions-container {
    display: flex;
    padding: 15px 0 0 15px;
    margin-bottom: 20px;
}

.sidebar-header .window-actions {
    display: flex;
    gap: 8px;
}

.app-window .window-dot {
    border-radius: 50%;
    /* display: inline-block; */
    height: 12px;
    /* margin-right: 6px; */
    /* margin-top: 4px; */
    width: 12px;
    border: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: rgba(0, 0, 0, 0);
}

.window-dot span {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-top: -3px;
    margin-right: -1px;
}

.app-window .window-actions:hover .window-dot {
    /* background: white!important; */
    /* cursor: pointer; */
    color: rgba(0, 0, 0, 0.5);
}


#content-view {
    background: #2C2733;
    flex: 1;
    display: flex;
    min-width: 0;
}



#categories {
    padding: 10px;
}

#categories img {
    width: 100%;
}

#categories .icon-wrapper {
    background: linear-gradient(#D3E3E9, #908F8C);
    width: 20px;
    height: 20px;
    border-radius: 6px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
}

#categories .icon-wrapper img {
    height: 14px;
    width: 14px;
}

/* .app-window .content {
    flex: 1;
}

.app-window .sidebar-header {
    display: flex;
    align-items: center;
    background: #444950;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
    padding: 10px 16px;
    min-height: 49px;
}

.app-window .window-dot {
    border-radius: 50%;
    display: inline-block;
    height: 12px;
    margin-right: 6px;
    margin-top: 4px;
    width: 12px;
}

.app-window .address-bar {
    display: flex;
    align-items: center;
    background-color: #1B1B1D;
    border-radius: 12.5px;
    color: #DADDE1;
    flex: 1 0;
    font: 400 13px Arial, sans-serif;
    margin: 0 1rem 0 .5rem;
    padding: 5px 15px;
}

.app-window .burger-bar {
    background-color: #aaa;
    display: block;
    height: 3px;
    margin: 3px 0;
    width: 17px;
}

.app-window .content {
    background: #292c30;
    display: flex;
    border: 3px solid #444950;
    border-top: 0;
    border-radius: 0 0 12px 12px;
    padding: 20px;
}


.app-window .browser-tabs {
    background: #444950;
    display: flex;
    padding: 0 10px;
    gap: 10px;
    user-select: none;
}

.app-window .browser-tabs .browser-tab {
    background: #1B1B1D;
    display: flex;
    border-radius: 12px 12px 0 0;
    padding: 6px 10px 3px 10px;
    align-items: center;
    gap: 6px;
    line-height: 1.5;
}

.app-window .browser-tabs .browser-tab:hover {
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
}

.app-window .browser-tabs .browser-tab.active {
    background: #292C30;
} */
</style>
