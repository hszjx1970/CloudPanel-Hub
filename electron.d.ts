// This tells TypeScript about the new `electronAPI` property on the global `window` object.
export interface IElectronAPI {
    getLocalIP: () => Promise<string | null>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
