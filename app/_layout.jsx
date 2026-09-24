import { Stack } from "expo-router";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
    token: null,
    login: async (email, password) => {},
    register: async (email, password) => {},
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function RootLayout() {
    const [token, setToken] = useState(null);

    const API_URL = "http://10.0.2.2:INSERT_PORT_NUMBER_OF_BACKEND";

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Invalid email or password");
            }

            if (data.token) {
                setToken(data.token);
            }
        } catch (error) {
            alert(error.message || "Something went wrong. Please try again.");
        }
    };

    const register = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            alert("Account created successfully! Please log in.");
        } catch (error) {
            alert(error.message || "Registration failed. Please try again.");
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, register, logout }}>
            <Stack screenOptions={{ headerShown: false }}>
                {/* When auth is up and working the below guard={!!token} will need to look like that, set up like this, so we can work on private tab files */}
                <Stack.Protected guard={!token} redirectTo="/(auth)/login">
                    <Stack.Screen name="(tabs)" />
                </Stack.Protected>
                {/* When auth is up and working the below guard={!token} will need to look like that */}
                <Stack.Protected guard={!!token} redirectTo="/(tabs)">
                    <Stack.Screen name="(auth)/login" />
                    <Stack.Screen name="(auth)/signup" />
                </Stack.Protected>
            </Stack>
        </AuthContext.Provider>
    );
}
