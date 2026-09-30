import React from "react";
import { Text, View } from "react-native";
import { render, screen, waitFor } from "@testing-library/react-native";

import TabLayout from "../../app/(tabs)/_layout";

let mockToken = "mock-token"
jest.mock("../../app/_layout", () => ({
    useAuth: () => ({
        token: mockToken,
    })
}))

jest.mock("expo-router", () => {
    const React = require("react")
    const { View } = require("react-native")
    const Tabs = ({ children }) => 
        React.createElement(
            View,
            { testID: "tabs" },
            children
        )
    Tabs.Screen = () => null
    return {
        Tabs,
    }
})

jest.mock("@expo/vector-icons", () => ({
    Ionicons: () => null,
}))

describe("TabLayout", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockToken = "mock-token"
        global.fetch = jest.fn()
    })
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it("fetches pantry items when a token exists", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => [],
        })
        await render(<TabLayout />)
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://4.225.221.72/pantry",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer mock-token",
                },
            })
        })
    })

    it("does not fetch pantry items when there is no token", async () => {
        mockToken = null
        await render(<TabLayout />)
        expect(global.fetch).not.toHaveBeenCalled()
    })

    
})