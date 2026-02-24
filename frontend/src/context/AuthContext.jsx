import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { verifyToken, logoutUser as apiLogout } from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize user from localStorage
    useEffect(() => {
        const initUser = async () => {
            try {
                const saved = localStorage.getItem('aquapure_user');
                if (saved) {
                    const userData = JSON.parse(saved);
                    // Verify token is still valid
                    if (userData.token) {
                        try {
                            await verifyToken();
                            setUser(userData);
                            setIsAuthenticated(true);
                        } catch (err) {
                            // Token expired, clear storage
                            localStorage.removeItem('aquapure_user');
                            setUser(null);
                            setIsAuthenticated(false);
                        }
                    }
                }
            } catch (e) {
                console.error("❌ Auth initialization error:", e);
                localStorage.removeItem('aquapure_user');
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initUser();
    }, []);

    const login = useCallback((userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('aquapure_user', JSON.stringify(userData));
    }, []);

    const logout = useCallback(async () => {
        try {
            await apiLogout();
        } catch (err) {
            console.warn('⚠️ Logout API error (continuing anyway):', err);
        }
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('aquapure_user');
    }, []);

    const updateUser = useCallback((data) => {
        setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...data };
            localStorage.setItem('aquapure_user', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
