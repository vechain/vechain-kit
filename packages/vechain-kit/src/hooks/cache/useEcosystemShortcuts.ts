import { useLocalStorage, LocalStorageKey } from './useLocalStorage';

export type EcosystemShortcut = {
    name: string;
    image: string;
    url: string;
    description?: string;
};

export const useEcosystemShortcuts = () => {
    const [shortcuts, setShortcuts] = useLocalStorage<EcosystemShortcut[]>(
        LocalStorageKey.ECOSYSTEM_SHORTCUTS,
        [],
    );

    const addShortcut = (shortcut: EcosystemShortcut) => {
        if (!shortcuts.some((s: EcosystemShortcut) => s.url === shortcut.url)) {
            setShortcuts([...shortcuts, shortcut]);
        }
    };

    const removeShortcut = (url: string) => {
        setShortcuts(shortcuts.filter((s: EcosystemShortcut) => s.url !== url));
    };

    const isShortcut = (url: string) => {
        return shortcuts.some((s: EcosystemShortcut) => s.url === url);
    };

    return {
        shortcuts,
        addShortcut,
        removeShortcut,
        isShortcut,
    };
};
