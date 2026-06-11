import {mount, unmount} from "svelte";
import type {Action} from "svelte/action";
import Tooltip from "$lib/components/Tooltip.svelte";

interface TooltipOptions {
    text: string;
    targets?: HTMLElement[];
}

export const tooltip: Action<HTMLElement, TooltipOptions> = (element, options) => {
    const tooltipProps = $state({text: options.text});

    const container = document.createElement("div");
    container.style.cssText = `
        position: fixed;
        transform: translate(-50%, -100%);
        z-index: 1000;
        pointer-events: none;
        display: flex;
        padding-bottom: 8px;
    `;

    let component: Tooltip | null = null;

    // let showTimer: ReturnType<typeof setTimeout>;
    // let visible = $state(false);

    const updatePosition = () => {
        const rect = element.getBoundingClientRect();
        container.style.left = `${rect.left + rect.width / 2}px`;
        container.style.top = `${rect.top}px`;
    };

    const show = () => {
        if (component) return;
        // showTimer = setTimeout(() => {
        document.body.appendChild(container);
        component = mount(Tooltip, {
            target: container,
            props: tooltipProps,
        });
        updatePosition();
        // visible = true;
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);


        // }, 0);
    };

    const hide = () => {
        // clearTimeout(showTimer);
        if (component) void unmount(component);
        component = null;
        container.remove();
        // visible = false;
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
    };

    const addListeners = (el: HTMLElement) => {
        el.addEventListener("mouseenter", show);
        el.addEventListener("mouseleave", hide);
        el.addEventListener("focus", show);
        el.addEventListener("blur", hide);
        el.addEventListener("input", show);
    };

    const removeListeners = (el: HTMLElement) => {
        el.removeEventListener("mouseenter", show);
        el.removeEventListener("mouseleave", hide);
        el.removeEventListener("focus", show);
        el.removeEventListener("blur", hide);
        el.removeEventListener("input", show);
    };

    const setupListeners = (targets: Array<HTMLElement | undefined>) => {
        targets.forEach(target => {
            if (target) addListeners(target);
        });
    };

    const destroyListeners = (targets: Array<HTMLElement | undefined>) => {
        targets.forEach(target => {
            if (target) removeListeners(target);
        });
    };

    const listenerTargets = $state(options.targets || []);

    setupListeners([element, ...listenerTargets]);

    // element.addEventListener("mouseenter", show);
    // element.addEventListener("mouseleave", hide);
    // element.addEventListener("focus", show);
    // element.addEventListener("blur", hide);

    return {
        update(newOptions: TooltipOptions) {
            // console.log("UPDATING", newOptions);
            const newText = newOptions.text.trim();
            if (tooltipProps.text !== newText) tooltipProps.text = newText;

            // if (newOptions.forceShow !== undefined) {
            //     if (newOptions.forceShow && !visible) {
            //         show();
            //     }
            //     else if (!newOptions.forceShow && visible) {
            //         hide();
            //     }
            // }
            if (newOptions.targets) {
                const removed = listenerTargets.filter(target => !newOptions.targets?.includes(target));
                destroyListeners(removed);

                const added = newOptions.targets.filter(target => !listenerTargets.includes(target));
                setupListeners(added);

                listenerTargets.splice(0, listenerTargets.length, ...newOptions.targets);
            }
            updatePosition();
        },
        destroy() {
            // console.log("DESTROYING", listenerTargets);
            // clearTimeout(showTimer);
            destroyListeners([element, ...listenerTargets]);
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
            if (component) void unmount(component);
            container.remove();
        },
    };
};


interface RelativeTooltipOptions {
    text: string;
    relativeTarget?: HTMLElement;
}

export const relativeTooltip: Action<HTMLElement, RelativeTooltipOptions> = (element, options) => {
    const tooltipProps = $state({text: options.text});

    const container = document.createElement("div");
    container.style.cssText = `
        position: fixed;
        transform: translate(-50%, -100%);
        z-index: 1000;
        pointer-events: none;
        display: flex;
        padding-bottom: 8px;
    `;

    let component: Tooltip | null = null;

    // let showTimer: ReturnType<typeof setTimeout>;
    // let visible = $state(false);

    const updatePosition = () => {
        const rect = (options.relativeTarget || element).getBoundingClientRect();
        container.style.left = `${rect.left + rect.width / 2}px`;
        container.style.top = `${rect.top}px`;
    };

    const show = () => {
        if (component) return;
        // showTimer = setTimeout(() => {
        document.body.appendChild(container);
        component = mount(Tooltip, {
            target: container,
            props: tooltipProps,
        });
        updatePosition();
        // visible = true;
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);


        // }, 0);
    };

    const hide = () => {
        // clearTimeout(showTimer);
        if (component) void unmount(component);
        component = null;
        container.remove();
        // visible = false;
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
    };

    const addListeners = (el: HTMLElement) => {
        el.addEventListener("mouseenter", show);
        el.addEventListener("mouseleave", hide);
        el.addEventListener("focus", show);
        el.addEventListener("blur", hide);
        el.addEventListener("input", show);
    };

    const removeListeners = (el: HTMLElement) => {
        el.removeEventListener("mouseenter", show);
        el.removeEventListener("mouseleave", hide);
        el.removeEventListener("focus", show);
        el.removeEventListener("blur", hide);
        el.removeEventListener("input", show);
    };

    const setupListeners = (targets: Array<HTMLElement | undefined>) => {
        targets.forEach(target => {
            if (target) addListeners(target);
        });
    };

    const destroyListeners = (targets: Array<HTMLElement | undefined>) => {
        targets.forEach(target => {
            if (target) removeListeners(target);
        });
    };

    setupListeners([element, options.relativeTarget]);

    // element.addEventListener("mouseenter", show);
    // element.addEventListener("mouseleave", hide);
    // element.addEventListener("focus", show);
    // element.addEventListener("blur", hide);

    return {
        update(newOptions: RelativeTooltipOptions) {
            // console.log("UPDATING", newOptions);
            const newText = newOptions.text.trim();
            if (tooltipProps.text !== newText) tooltipProps.text = newText;

            // if (newOptions.forceShow !== undefined) {
            //     if (newOptions.forceShow && !visible) {
            //         show();
            //     }
            //     else if (!newOptions.forceShow && visible) {
            //         hide();
            //     }
            // }
            // if (newOptions.targets) {
            //     const removed = listenerTargets.filter(target => !newOptions.targets?.includes(target));
            //     destroyListeners(removed);

            //     const added = newOptions.targets.filter(target => !listenerTargets.includes(target));
            //     setupListeners(added);

            //     listenerTargets.splice(0, listenerTargets.length, ...newOptions.targets);
            // }
            updatePosition();
        },
        destroy() {
            // console.log("DESTROYING", listenerTargets);
            // clearTimeout(showTimer);
            destroyListeners([element, options.relativeTarget]);
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
            if (component) void unmount(component);
            container.remove();
        },
    };
};