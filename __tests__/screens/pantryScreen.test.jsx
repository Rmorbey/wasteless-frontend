import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";

import PantryScreen from "../../app/(tabs)/index.jsx";

const mockFetchPantryFromBackend = jest.fn()
jest.mock("../../app/(tabs)/_layout", () => ({
    usePantry: () => ({
        pantryItems: [
            {
                id: "1",
                name: "Milk",
                quantity: 1,
                expiry_date: "2026-09-27T00:00:00.000Z"
            },
        ],
        fetchPantryFromBackend: mockFetchPantryFromBackend,
    }),
}))
jest.mock("../../app/_layout", () => ({
    useAuth: () => ({
        token: "mock-token",
        userId: 123,
    }),
}))

describe("PantryScreen", () => {
    beforeEach(async () => {
        jest.clearAllMocks()
        jest.spyOn(Alert, "alert").mockImplementation(() => {})
        await render(<PantryScreen />)
    })
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it("renders the intial pantry items and item count", async () => {
        expect(screen.getByText("My Pantry")).toBeTruthy()
        expect(screen.getByText("0 Items")).toBeTruthy()
    })

    it("opens the add food modal", async () => {
        await fireEvent.press(screen.getByText("+ Add Food"))
        expect(screen.getByText("Add Food.")).toBeTruthy()
        expect(screen.getByText("Add Manually.")).toBeTruthy()
        expect(screen.getByText("Cancel")).toBeTruthy()
    })

    it("opens the manual food form", async () => {
        await fireEvent.press(screen.getByText("+ Add Food"))
        await fireEvent.press(screen.getByText("Add Manually."))
        expect(screen.getByPlaceholderText("food name")).toBeTruthy()
        expect(screen.getByPlaceholderText("quantity")).toBeTruthy()
        expect(screen.getByText("Add to pantry")).toBeTruthy()
        expect(screen.getByText("Back")).toBeTruthy()
    })

    it("adds a new food item to the pantry", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                message: "Item added successfully",
            }),
        })
        await fireEvent.press(screen.getByText("+ Add Food"))
        await fireEvent.press(screen.getByText("Add Manually."))
        await fireEvent.changeText(screen.getByPlaceholderText("food name"), "Apples")
        await fireEvent.changeText(screen.getByPlaceholderText("quantity"), "4")
        await fireEvent.press(screen.getByText("Add to pantry"))
        expect(global.fetch).toHaveBeenCalledWith("http://4.225.221.72/pantry",
            expect.objectContaining({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer mock-token",
                },
            })
        )
        expect(mockFetchPantryFromBackend).toHaveBeenCalled()
        expect(Alert.alert).toHaveBeenCalledWith("Success", "Apples added to your pantry.")
    })

    it("shows an alert when required information is missing", async () => {
        await fireEvent.press(screen.getByText("+ Add Food"))
        await fireEvent.press(screen.getByText("Add Manually."))
        await fireEvent.press(screen.getByText("Add to pantry"))
        expect(Alert.alert).toHaveBeenCalledWith(
            "Missing information.",
            "Please enter a food name and an expiry date."
        )
        expect(global.fetch).not.toHaveBeenCalled()
    })

    it("shows an error alert when adding food fails", async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                error: "Failed to add item",
            }),
        })
        await fireEvent.press(screen.getByText("+ Add Food"))
        await fireEvent.press(screen.getByText("Add Manually."))
        await fireEvent.changeText(screen.getByPlaceholderText("food name"), "Apples")
        await fireEvent.press(screen.getByText("Add to pantry"))
        expect(Alert.alert).toHaveBeenCalledWith("Error", "Could not add item to server.")
        expect(mockFetchPantryFromBackend).not.toHaveBeenCalled()
    })

    it("scans a receipt and refreshes the pantry", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                message: "Receipt processed",
            }),
        })
        await fireEvent.press(screen.getByText("+ Add Food"))
        await fireEvent.press(screen.getByText("Scan Receipt."))
        expect(global.fetch).toHaveBeenCalledWith("http://4.225.221.72/scan-receipt",
            expect.objectContaining({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer mock-token",
                },
            })
        )
        expect(mockFetchPantryFromBackend).toHaveBeenCalled()
        expect(Alert.alert).toHaveBeenCalledWith("Success", "Receipt processed and items added to your pantry")
    })
    
    it("shows an error alert when receipt scanning fails", async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                error: "Scan failed",
            }),
        })
        await fireEvent.press(screen.getByText("+ Add Food"))
        await fireEvent.press(screen.getByText("Scan Receipt."))
        expect(Alert.alert).toHaveBeenCalledWith("Scanning Error", "Failed to extract items. Ensure image is clear.")
    })
})