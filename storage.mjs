export const localStorageGetItem = (key) => window.localStorage.getItem(key);
export const localStorageSetItem = (key, value) => {
    window.localStorage.setItem(key, value);
};
export const localStorageRemoveItem = (key) => {
    window.localStorage.removeItem(key);
};
export const isLocalStorageAccessible = () => {
    try {
        window.localStorage.setItem("twofac_ls_test", "1");
        window.localStorage.removeItem("twofac_ls_test");
        return true;
    }
    catch {
        return false;
    }
};
const extensionGlobals = globalThis;
const getBrowserSessionStorage = () => {
    return extensionGlobals.browser?.storage?.session;
};
const getChromeSessionStorage = () => {
    return extensionGlobals.chrome?.storage?.session;
};
const getChromeRuntimeError = () => {
    return extensionGlobals.chrome?.runtime?.lastError?.message ?? null;
};
const chromeGet = (storageArea, key) => {
    return new Promise((resolve, reject) => {
        storageArea.get(key, (items) => {
            const errorMessage = getChromeRuntimeError();
            if (errorMessage) {
                reject(new Error(errorMessage));
                return;
            }
            resolve(items);
        });
    });
};
const chromeSet = (storageArea, items) => {
    return new Promise((resolve, reject) => {
        storageArea.set(items, () => {
            const errorMessage = getChromeRuntimeError();
            if (errorMessage) {
                reject(new Error(errorMessage));
                return;
            }
            resolve();
        });
    });
};
const chromeRemove = (storageArea, key) => {
    return new Promise((resolve, reject) => {
        storageArea.remove(key, () => {
            const errorMessage = getChromeRuntimeError();
            if (errorMessage) {
                reject(new Error(errorMessage));
                return;
            }
            resolve();
        });
    });
};
export const isExtensionSessionStorageAccessible = () => {
    return Boolean(getBrowserSessionStorage() ?? getChromeSessionStorage());
};
export const extensionSessionStorageGetItem = async (key) => {
    try {
        const browserStorage = getBrowserSessionStorage();
        if (browserStorage) {
            const items = await browserStorage.get(key);
            const value = items[key];
            return { value: typeof value === "string" ? value : null };
        }
        const chromeStorage = getChromeSessionStorage();
        if (chromeStorage) {
            const items = await chromeGet(chromeStorage, key);
            const value = items[key];
            return { value: typeof value === "string" ? value : null };
        }
    }
    catch {
        return { value: null };
    }
    return { value: null };
};
export const extensionSessionStorageSetItem = async (key, value) => {
    try {
        const browserStorage = getBrowserSessionStorage();
        if (browserStorage) {
            await browserStorage.set({ [key]: value });
            return { success: true };
        }
        const chromeStorage = getChromeSessionStorage();
        if (chromeStorage) {
            await chromeSet(chromeStorage, { [key]: value });
            return { success: true };
        }
    }
    catch {
        return { success: false };
    }
    return { success: false };
};
export const extensionSessionStorageRemoveItem = async (key) => {
    try {
        const browserStorage = getBrowserSessionStorage();
        if (browserStorage) {
            await browserStorage.remove(key);
            return { success: true };
        }
        const chromeStorage = getChromeSessionStorage();
        if (chromeStorage) {
            await chromeRemove(chromeStorage, key);
            return { success: true };
        }
    }
    catch {
        return { success: false };
    }
    return { success: false };
};
