import { createContext, useContext } from 'react';

type BottomSheetContextType = {
    isInsideBottomSheet: boolean;
};

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

export const useBottomSheetContext = () => {
    const context = useContext(BottomSheetContext);
    return context;
};

export const BottomSheetProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <BottomSheetContext.Provider value={{ isInsideBottomSheet: true }}>
            {children}
        </BottomSheetContext.Provider>
    );
};
