import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#4CAF50",
                headerShown: true,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{ tabBarLabel: "Pantry", headerTitle: "Pantry" }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{ tabBarLabel: "Dashboard", headerTitle: "Dashboard" }}
            />
            <Tabs.Screen
                name="donation"
                options={{ tabBarLabel: "Donations", headerTitle: "Donations" }}
            />
        </Tabs>
    );
}
