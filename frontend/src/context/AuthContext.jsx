import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('aquapure_user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Auth initialization error:", e);
            localStorage.removeItem('aquapure_user');
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('aquapure_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('aquapure_user');
    };

    const updateUser = (data) => {
        setUser(prev => {
            const updated = { ...prev, ...data };
            localStorage.setItem('aquapure_user', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};
