import { Stack } from "expo-router";
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({
    token: null,
    user_id: null,
    login: async (username, password) => {},
    register: async (username, password) => {},
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function RootLayout() {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null)

    const API_URL = "http://4.225.221.72";
    const local_URL = 'http://localhost'

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Invalid email or password");
            }

            if (response.ok && data.token) {
                setToken(data.token)
                console.log('this is login data: ', data)
                console.log('this is login user id: ', data.user_id)
                setUserId({ user_id: data.user_id })
            } else {
                alert(data.error || 'Login failed')
            }
        } catch (error) {
            alert(error.message || "Something went wrong. Please try again.");
        }
    };

    const register = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
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
        <AuthContext.Provider value={{ token, userId, login, register, logout }}>
            <Stack screenOptions={{ headerShown: false }}>
                {/* When auth is up and working the below guard={!!token} will need to look like that, set up like this, so we can work on private tab files */}
                <Stack.Protected guard={!!token} redirectTo="/(auth)/login">
                    <Stack.Screen name="(tabs)" />
                </Stack.Protected>
                {/* When auth is up and working the below guard={!token} will need to look like that */}
                <Stack.Protected guard={!token} redirectTo="/(tabs)">
                    <Stack.Screen name="(auth)/login" />
                    <Stack.Screen name="(auth)/signup" />
                </Stack.Protected>
            </Stack>
        </AuthContext.Provider>
    );
}
