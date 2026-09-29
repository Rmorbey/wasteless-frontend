import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";

import PantryScreen from "../../app/(tabs)/index.jsx";

describe("PantryScreen", () => {
    beforeEach(async () => {
        await render(<PantryScreen />)
    })
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it("renders the intial pantry items and item count", async () => {
        expect(screen.getByText("My Pantry")).toBeTruthy()
        expect(screen.getByText("6 Items")).toBeTruthy()
        expect(screen.getByText("Milk")).toBeTruthy()
        expect(screen.getByText("Eggs")).toBeTruthy()
        expect(screen.getByText("Bread")).toBeTruthy()
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
        expect(screen.getByPlaceholderText("expiry date(YYYY-MM-DD)")).toBeTruthy()
        expect(screen.getByText("Add to pantry")).toBeTruthy()
        expect(screen.getByText("Back")).toBeTruthy()
    })

    it("adds a new food item to the pantry", async () => {
        await fireEvent.press(screen.getByText("+ Add Food"))
        await fireEvent.press(screen.getByText("Add Manually."))
        await fireEvent.changeText(screen.getByPlaceholderText("food name"), "Apples")
        await fireEvent.changeText(screen.getByPlaceholderText("quantity"), "4")
        await fireEvent.changeText(screen.getByPlaceholderText("expiry date(YYYY-MM-DD)"), "2026-10-15")
        await fireEvent.press(screen.getByText("Add to pantry"))
        expect(screen.getByText("Apples")).toBeTruthy()
        expect(screen.getByText("Quantity: 4")).toBeTruthy()
        expect(screen.getByText("2026-10-15")).toBeTruthy()
        expect(screen.getByText("7 Items")).toBeTruthy()
    })

    it("shows an alert when required information is missing", async () => {
        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {})
        await fireEvent.press(screen.getByText("+ Add Food"))
        await fireEvent.press(screen.getByText("Add Manually."))
        await fireEvent.press(screen.getByText("Add to pantry"))
        expect(alertSpy).toHaveBeenCalledWith(
            "Missing information.",
            "Please enter a food name and an expiry date."
        )
    })
})