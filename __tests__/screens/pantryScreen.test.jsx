import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";

import PantryScreen from "../../app/(tabs)/index.jsx";

describe("PantryScreen", () => {
    it("renders the intial pantry items and item count", async () => {
        await render(<PantryScreen />)

        expect(screen.getByText("My Pantry")).toBeTruthy()
        expect(screen.getByText("6 Items")).toBeTruthy()
        expect(screen.getByText("Milk")).toBeTruthy()
        expect(screen.getByText("Eggs")).toBeTruthy()
        expect(screen.getByText("Bread")).toBeTruthy()
    })
})