import { Tabs } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from '../_layout'
import { Ionicons } from "@expo/vector-icons";

const PantryContext = createContext({
    pantryItems: [],
    fetchPantryFromBackend: async () => {},
    setPantryItems: () => {}
})

export const usePantry = () => useContext(PantryContext)

export default function TabLayout() {
    const { token } = useAuth()

    const [ pantryItems, setPantryItems ] = useState([])

    const fetchPantryFromBackend = async () => {
        if (!token) return

        try {
            const response = await fetch ('http://4.225.221.72/pantry', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await response.json()
            console.log('outside response.ok pantry fetch: ', data)

            if (response.ok && Array.isArray(data)) {
                console.log('inside reponse.ok fetch pantry data: ', data)
                const sortedItems = data.sort((a, b) => {
                    if (!a.expiry_date) return 1
                    if (!b.expiry_date) return -1
                    return new Date(a.expiry_date) - new Date(b.expiry_date)
                })
                setPantryItems(sortedItems)
            }
        } catch (error) {
            console.error("Database loading error:", error.message)
        }
    }

    useEffect(() => {
        fetchPantryFromBackend()
    }, [token])

    return (
        <PantryContext.Provider value={{ pantryItems, fetchPantryFromBackend, setPantryItems}}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#4CAF50",
                    tabBarInactiveTintColor: '#666',
                    headerShown: true,
                    tabBarStyle: {
                        height: 60,
                        paddingBottom: 8,
                        paddingTop: 8,
                        backgroundColor: '#fff'
                    }
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{ tabBarLabel: "Pantry", headerTitle: "Pantry", tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'basket' : "basket-outline"} size={22} color={color} />
                    )
                    }}
                />
                <Tabs.Screen
                    name="dashboard"
                    options={{ tabBarLabel: "Dashboard", headerTitle: "Dashboard", tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'stats-chart' : "stats-chart-outline"} size={22} color={color} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="donation"
                    options={{ tabBarLabel: "Donations", headerTitle: "Donations", tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'heart' : "heart-outline"} size={22} color={color} />
                    ) }}
                />
            </Tabs>
        </PantryContext.Provider>
    );
}
