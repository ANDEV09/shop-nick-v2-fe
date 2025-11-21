/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { eraseCookie } from "../utils/functions";

type AnyObject = Record<string, unknown>;

interface AuthContextType {
    user: AnyObject | null;
    login: (userData: AnyObject) => void;
    logout: (navigate?: (path: string) => void) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AnyObject | null>(() => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    });

    // On mount: if user has access_token but thiếu role, fetch profile
    useEffect(() => {
        if (user && user.access_token && !user.role) {
            (async () => {
                try {
                    const res = await fetch("http://localhost:8000/auth/profile", {
                        headers: { Authorization: `Bearer ${user.access_token}` },
                    });
                    const data = await res.json();
                    if (res.ok && data?.result) {
                        let role = data.result.role;
                        if (role && typeof role === "string") role = role.toUpperCase();
                        setUser({ ...data.result, access_token: user.access_token, role });
                        // update localStorage too
                        localStorage.setItem(
                            "user",
                            JSON.stringify({
                                ...data.result,
                                access_token: user.access_token,
                                role,
                            }),
                        );
                    }
                } catch (e) {
                    // ignore
                }
            })();
        }
    }, [user]);

    const login = (userData: AnyObject) => {
        // keep full user in memory for app use
        setUser(userData);
        // but persist only minimal info to localStorage: name and access_token (if present)
        const minimal: AnyObject = {};
        if (typeof userData === "object" && userData !== null) {
            if (Object.prototype.hasOwnProperty.call(userData, "name")) {
                minimal["name"] = (userData as AnyObject)["name"];
            }
            if (Object.prototype.hasOwnProperty.call(userData, "access_token")) {
                minimal["access_token"] = (userData as AnyObject)["access_token"];
            }
        }
        localStorage.setItem("user", JSON.stringify(minimal));
    };

    const logout = (navigate?: (path: string) => void) => {
        setUser(null);
        localStorage.removeItem("user");
        // remove tokens from cookies if present
        try {
            eraseCookie("access_token");
            eraseCookie("refresh_token");
        } catch {
            // ignore
        }
        // redirect to login page if navigate function provided
        if (navigate) {
            navigate("/login");
        }
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext)!;
