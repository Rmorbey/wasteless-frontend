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

    it("handles a successful pantry response", async () => {
        const mockPantryItems = [
            {
                id: "1",
                name: "Milk",
                expiry_date: "2026-10-03",
            },
            {
                id: "2",
                name: "Bread",
                expiry_date: "2026-10-01",
            },
        ]
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => mockPantryItems,
        })
        await render(<TabLayout />)
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1)
        })
    })

    it("handles pantry fetch errors", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
        global.fetch.mockRejectedValue(new Error("Database unavailable"))
        await render(<TabLayout />)
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Database loading error:", "Database unavailable" 
            )
        })
    })

    it("renders the tabs layout", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => [],
        })
        const { getByTestId } = await render(<TabLayout />)
        expect(getByTestId("tabs")).toBeTruthy()
    })
})