// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
interface ImportMetaEnv {
    readonly VITE_PERSIST_STATE: string;
}

declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
