export function debounce (fn: Function, wait = 0, options: any = {}) {
    // @ts-ignore
    let timeout: NodeJS.Timeout | null;

    return (...args: any) => {
        const immediate = 'immediate' in options ? !!options.immediate : options.immediate
        const later = () => {
            timeout = null
            if (!immediate) {
                // @ts-ignore
                fn.apply(this, args)
            }
        }
        const now = immediate && !timeout
        if (timeout !== null) clearTimeout(timeout);
        timeout = setTimeout(later, wait)
        if (now) {
            // @ts-ignore
            fn.apply(this, args)
        }
        return timeout
    }
}
