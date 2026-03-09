type ToastType = "success" | "error";

type ToastRequest = {
    id: string;
    type: ToastType;
    message: string;
    duration: number;
};

interface ToastOptions {
    message: string;
    duration?: number;
}

const DEFAULT_DURATION = 3000;

let toastStack: ToastRequest[] = $state([]);
let nextToastId = 0;

function getNextId() {
    nextToastId += 1;
    return `toast-${nextToastId}`;
}

function removeById(id: string) {
    toastStack = toastStack.filter((toast) => toast.id !== id);
}

export function getToasts() {
    return toastStack;
}

function addToast(options: ToastOptions | string, type: ToastType) {
    const message = typeof options === "string" ? options : options.message;
    const duration = typeof options === "string" ? DEFAULT_DURATION : options.duration ?? DEFAULT_DURATION;

    const toast: ToastRequest = {
        id: getNextId(),
        type,
        message,
        duration
    };

    toastStack = [toast, ...toastStack];

    setTimeout(() => {
        removeById(toast.id);
    }, duration);
}

export function success(options: ToastOptions | string): void {
    addToast(options, "success");
}

export function error(options: ToastOptions | string): void {
    addToast(options, "error");
}

export function dismissToast(id: string): void {
    removeById(id);
}
