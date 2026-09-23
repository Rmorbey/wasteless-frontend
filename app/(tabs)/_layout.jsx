import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#4CAF50",
                headerShown: true,
            }}
        ></Tabs>
    );
}
