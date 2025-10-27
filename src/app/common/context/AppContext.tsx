// app/context/AppContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type AppContextType = {
    userData: { name: string; role: string } | null;
    updateUserData: (data: { name: string; role: string } | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);

    const updateUserData = (data: { name: string; role: string } | null) => {
        setUserData(data);
    };

    return (
        <AppContext.Provider value={{ userData, updateUserData }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}