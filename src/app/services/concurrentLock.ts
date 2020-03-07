export const concurrentLock = <T>(proc: () => PromiseLike<T>) => {
    let locked: Promise<T> | false = false;

    return () => {
        if (!locked) {
            locked = (async () => {
                try {
                    return await proc();
                } finally {
                    locked = false;
                }
            })();
        }
        return locked;
    };
};
