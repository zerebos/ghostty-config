import type {Attachment} from "svelte/attachments";


export const toRoot: Attachment = (node: Element) => {
    document.body.appendChild(node);
    return () => {
        node.remove();
    };
};

export const toAppWindow: Attachment = (node: Element) => {
    const appWindow = document.querySelector(".app-window");
    if (!appWindow) return toRoot(node);
    appWindow.appendChild(node);
    return () => {
        node.remove();
    };
};