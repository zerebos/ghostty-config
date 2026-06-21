type DebouncedFunction<Args extends unknown[]> = ((...args: Args) => void) & {
    cancel: () => void;
};

export function debounce<Args extends unknown[]>(
    fn: (...args: Args) => void,
    wait: number,
    {leading = true, trailing = false}: {leading?: boolean; trailing?: boolean;} = {}
): DebouncedFunction<Args> {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const debounced = (...args: Args) => {
        const isCooldownActive = timeout !== undefined;

        if (timeout !== undefined) clearTimeout(timeout);

        timeout = setTimeout(() => {
            timeout = undefined;
            if (trailing && (!leading || isCooldownActive)) fn(...args);
        }, wait);

        if (leading && !isCooldownActive) fn(...args);
    };

    debounced.cancel = () => {
        if (timeout !== undefined) clearTimeout(timeout);
        timeout = undefined;
    };

    return debounced;
}


type PendingGuardedFunction<Args extends unknown[]> = ((...args: Args) => void) & {
    readonly pending: boolean;
};

export function withPendingGuard<Args extends unknown[]>(
    fn: (...args: Args) => Promise<unknown>
): PendingGuardedFunction<Args> {
    let pending = false;

    const guarded = (...args: Args) => {
        if (pending) return;
        pending = true;

        // Guard against both synchronous and asynchronous errors to ensure pending is reset correctly
        try {
            const result = fn(...args);
            void Promise.resolve(result).finally(() => {
                pending = false;
            });
        }
        catch (err) {
            pending = false;
            throw err;
        }
    };

    Object.defineProperty(guarded, "pending", {
        get: () => pending,
    });

    return guarded as PendingGuardedFunction<Args>;
}