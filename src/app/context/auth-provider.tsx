'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

// 認証状態を格納するコンテキスト
interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  username: string | null;
}

// 認証状態のコンテキスト
const AuthContext = createContext<AuthContextType>({ isAuthenticated: false, loading: true, username: null });

// useAuth カスタムフック
export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider
 * @param children
 * @returns JSX
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const loginPath = '/user/login';
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === loginPath || pathname === '/user/register') {
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                    setUsername(response.data.username);
                } else {
                    setIsAuthenticated(false);
                    setUsername(null);
                    router.push(loginPath);
                }
            } catch (error) {
                console.log('Authentication check failed:', error);
                setIsAuthenticated(false);
                setUsername(null);
                router.push(loginPath);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router, pathname]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, username }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};
