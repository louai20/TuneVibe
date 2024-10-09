import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    id: string;
    name: string;
    email: string;
}

type AuthMode = "login" | "register" | null;

interface GlobalState {
    user: User | null;
    theme: "light" | "dark";
    setUser: (user: User | null) => void;
    toggleTheme: () => void;

    authModal: {
        isOpen: boolean;
        mode: AuthMode;
    };
    openAuthModal: (mode: AuthMode) => void;
    closeAuthModal: () => void;

    loginEmail: string;
    setLoginEmail: (value: string) => void;
    loginPassword: string;
    setLoginPassword: (value: string) => void;

    registerName: string;
    setRegisterName: (value: string) => void;
    registerEmail: string;
    setRegisterEmail: (value: string) => void;
    registerPassword: string;
    setRegisterPassword: (value: string) => void;

    error: string;
    setError: (value: string) => void;
}

const useStore = create<GlobalState>()(
    persist(
        (set) => ({
            user: null,
            theme: "light",
            setUser: (user: User | null) => set({ user }),
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === "light" ? "dark" : "light",
                })),

            authModal: {
                isOpen: false,
                mode: null,
            },
            openAuthModal: (mode: AuthMode) =>
                set({
                    authModal: {
                        isOpen: true,
                        mode,
                    },
                }),
            closeAuthModal: () =>
                set({
                    authModal: {
                        isOpen: false,
                        mode: null,
                    },
                }),

            loginEmail: "",
            setLoginEmail: (value: string) => set({ loginEmail: value }),
            loginPassword: "",
            setLoginPassword: (value: string) => set({ loginPassword: value }),

            registerName: "",
            setRegisterName: (value: string) => set({ registerName: value }),
            registerEmail: "",
            setRegisterEmail: (value: string) => set({ registerEmail: value }),
            registerPassword: "",
            setRegisterPassword: (value: string) =>
                set({ registerPassword: value }),

            error: "",
            setError: (value: string) => set({ error: value }),
        }),
        {
            name: "global-storage",
        }
    )
);

export default useStore;
