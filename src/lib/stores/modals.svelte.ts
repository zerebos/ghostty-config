type ConfirmModalRequest = {
    id: string;
    kind: "confirm";
    title: string;
    message: string | null;
    confirmText: string;
    cancelText: string;
    iconSrc: string | undefined;
    iconAlt: string;
    resolve: (value: boolean) => void;
};

type AlertModalRequest = {
    id: string;
    kind: "alert";
    title: string;
    message: string | null;
    buttonText: string;
    iconSrc: string | undefined;
    iconAlt: string;
    resolve: () => void;
};

export type ModalRequest = ConfirmModalRequest | AlertModalRequest;

interface ConfirmOptions {
    title: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    iconSrc?: string;
    iconAlt?: string;
}

interface AlertOptions {
    title: string;
    message?: string;
    buttonText?: string;
    iconSrc?: string;
    iconAlt?: string;
}

let modalStack: ModalRequest[] = $state([]);
let nextModalId = 0;

function getNextId() {
    nextModalId += 1;
    return `modal-${nextModalId}`;
}

function removeById(id: string) {
    modalStack = modalStack.filter((modal) => modal.id !== id);
}

export function getTopModal() {
    return modalStack.length ? modalStack[modalStack.length - 1] : null;
}

export function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        const modal: ConfirmModalRequest = {
            id: getNextId(),
            kind: "confirm",
            title: options.title,
            message: options.message ?? null,
            confirmText: options.confirmText ?? "Confirm",
            cancelText: options.cancelText ?? "Cancel",
            iconSrc: options.iconSrc,
            iconAlt: options.iconAlt ?? "Warning",
            resolve
        };
        modalStack = [...modalStack, modal];
    });
}

export function alert(options: AlertOptions): Promise<void> {
    return new Promise<void>((resolve) => {
        const modal: AlertModalRequest = {
            id: getNextId(),
            kind: "alert",
            title: options.title,
            message: options.message ?? null,
            buttonText: options.buttonText ?? "Close",
            iconSrc: options.iconSrc,
            iconAlt: options.iconAlt ?? "Notice",
            resolve
        };
        modalStack = [...modalStack, modal];
    });
}

export function resolveTopConfirm(value: boolean) {
    const modal = getTopModal();
    if (!modal || modal.kind !== "confirm") return;
    modal.resolve(value);
    removeById(modal.id);
}

export function resolveTopAlert() {
    const modal = getTopModal();
    if (!modal || modal.kind !== "alert") return;
    modal.resolve();
    removeById(modal.id);
}

export function dismissTopModal() {
    const modal = getTopModal();
    if (!modal) return;

    if (modal.kind === "confirm") {
        modal.resolve(false);
    }
    else {
        modal.resolve();
    }

    removeById(modal.id);
}
