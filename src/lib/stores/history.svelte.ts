import type {OnNavigate} from "@sveltejs/kit";

let stack: string[] = $state([window.location.pathname]);
let index = $state(0);

export function canGoBack() {
    return index > 0;
}

export function canGoForward() {
    return index < stack.length - 1;
}

export function processNavigation(navEvent: OnNavigate) {
    if (navEvent.type !== "link" && navEvent.type !== "popstate") return;

    if (navEvent.type === "link") {
        if (!navEvent?.to?.url) return; // Sanity check
        if (index === stack.length - 1) {
            stack = [...stack, navEvent.to.url.pathname];
        }
        else {
            const substack = stack.slice(0, index + 1);
            stack = [...substack, navEvent.to.url.pathname];
        }

        index = stack.length - 1;
    }

    if (navEvent.type === "popstate") {
        index += navEvent.delta!;

        // Clamp values if the user uses browser history
        // to navigate beyond our stack
        if (index < 0) {
            index = 0;
            stack = [window.location.pathname];
        }
        if (index > stack.length - 1) {
            index = stack.length - 1;
        }
    }
}