import type {Attachment} from "svelte/attachments";
import {mount, unmount} from "svelte";
import Tooltip from "$lib/components/Tooltip.svelte";

type TooltipText = string | (() => string);

function getTooltipText(text: TooltipText): string {
    return typeof text === "function" ? text() : text;
}

export function createTooltipAttachment(text: TooltipText): Attachment {
    return (element) => {
        let component: Tooltip;
        let tooltipRoot: HTMLDivElement | null = null;

        const updatePosition = () => {
            if (!tooltipRoot) return;
            const rect = element.getBoundingClientRect();
            tooltipRoot.style.left = `${rect.left + rect.width / 2}px`;
            tooltipRoot.style.top = `${rect.top - 8}px`;
        };

        const hideTooltip = async () => {
            if (!tooltipRoot) return;
            const root = tooltipRoot;
            tooltipRoot = null;
            await unmount(component);
            root.remove();
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };

        const showTooltip = () => {
            if (tooltipRoot) return;
            const content = getTooltipText(text).trim();
            if (!content) return;

            tooltipRoot = document.createElement("div");
            tooltipRoot.style.position = "fixed";
            tooltipRoot.style.transform = "translate(-50%, -100%)";
            tooltipRoot.style.zIndex = "1000";
            tooltipRoot.style.pointerEvents = "none";

            document.body.append(tooltipRoot);
            component = mount(Tooltip, {
                target: tooltipRoot,
                props: {
                    text: content
                }
            });

            updatePosition();
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);
        };

        element.addEventListener("mouseenter", showTooltip);
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        element.addEventListener("mouseleave", hideTooltip);
        element.addEventListener("focus", showTooltip);
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        element.addEventListener("blur", hideTooltip);

        return () => {
            element.removeEventListener("mouseenter", showTooltip);
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            element.removeEventListener("mouseleave", hideTooltip);
            element.removeEventListener("focus", showTooltip);
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            element.removeEventListener("blur", hideTooltip);
            void hideTooltip();
        };
    };
}