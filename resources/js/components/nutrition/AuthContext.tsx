import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    initials: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
    id: '1',
    name: 'Dr. Gustavo',
    email: 'nutri@clinicagustavo.com',
    initials: 'DG',
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (email && password.length >= 4) {
            setUser(MOCK_USER);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
