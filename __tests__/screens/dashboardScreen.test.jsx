import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import DashboardScreen from "../../app/(tabs)/dashboard";

const mockLineChart = jest.fn()
jest.mock("../../app/_layout", () => ({
    useAuth: () => ({
        token: "mock-token",
    }),
}))

jest.mock("react-native-gifted-charts", () => {
    const React = require("react")
    const { View } = require("react-native");
    return {
        LineChart: (props) => {
            mockLineChart(props)
            return React.createElement(View, {
                testID: "line-chart",
            })
        },
    }
})

jest.mock("expo-linear-gradient", () => {
    const React = require("react")
    const { View } = require("react-native")
    return {
        LinearGradient: ({ children }) => 
            React.createElement(View, null, children),
    }
})

jest.mock("@expo/vector-icons", () => ({
    Ionicons: () => null,
}))

describe("DashboardScreen", () => {
    const mockDashboardData = {
        total_donated: 30,
        total_used: 50,
        total_wasted: 20,
        donated_percentage: "30.0",
        used_percentage: "50.0",
        wasted_percentage: "20.0",
        monthly_analysis: [
            {
                year_month: "2026-01",
                wasted: 5,
                used: 10,
                donated: 3,
            },
            {
                year_month: "2026-02",
                wasted: 4,
                used: 12,
                donated: 6,
            },
            {
                year_month: "2026-03",
                wasted: 2,
                used: 15,
                donated: 8,
            },
        ],
    }
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => mockDashboardData,
        })
    })
    afterEach(() => {
        jest.restoreAllMocks()
    })
    async function rednerDashboard() {
        await render(<DashboardScreen />)
    }

    it("fetches dashboard analytics when the screen loads", async () => {
        await rednerDashboard()
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost/dashboard",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer mock-token"
                    },
                }
            )
        })
    })

    it("renders the dashboard headings", async () => {
        await rednerDashboard()
        expect(screen.getByText("Overview Analytics (2026)")).toBeTruthy()
        expect(screen.getByText("Food Inventory Trends")).toBeTruthy()
    })

    it("displays analytics returned from the backend", async () => {
        await rednerDashboard()
        expect(await screen.findByText("30 Items Donated (30.0%)")).toBeTruthy()
        expect(screen.getByText("80%")).toBeTruthy()
        expect(screen.getByText("Pantry Efficiency (80 items saved/donated)")).toBeTruthy()
        expect(screen.getByText("20%")).toBeTruthy()
        expect(screen.getByText("Total Food Waste (20 Items)")).toBeTruthy()
    })

    it("calculates the estimated number of donated meals", async () => {
        await rednerDashboard()
        expect(await screen.findByText("Provided approx. 20 meals to local families in need")).toBeTruthy()
    })

    it("converts monthly analytics into chart data", async () => {
        await rednerDashboard()
        await waitFor(() => {
            const latestCall = mockLineChart.mock.calls[mockLineChart.mock.calls.length - 1][0]
            expect(latestCall.dataSet[0].data).toEqual([
                { value: 5, label: "Jan" },
                { value: 4, label: "Feb" },
                { value: 2, label: "Mar" },
            ])
            expect(latestCall.dataSet[1].data).toEqual([
                { value: 10, label: "Jan" },
                { value: 12, label: "Feb" },
                { value: 15, label: "Mar" },
            ])
            expect(latestCall.dataSet[2].data).toEqual([
                { value: 3, label: "Jan" },
                { value: 6, label: "Feb" },
                { value: 8, label: "Mar" },
            ])
        })
    })

    it("shows only the wasted legend when wasted is selected", async () => {
        await rednerDashboard()
        await screen.findByText("30 Items Donated (30.0%)")
        expect(screen.getAllByText("Wasted")).toHaveLength(2)
        expect(screen.getAllByText("Used")).toHaveLength(2)
        expect(screen.getAllByText("Donated")).toHaveLength(2)
        const wastedTexts = screen.getAllByText("Wasted")
        await fireEvent.press(wastedTexts[wastedTexts.length -1])
        expect(screen.getAllByText("Wasted")).toHaveLength(2)
        expect(screen.getAllByText("Used")).toHaveLength(1)
        expect(screen.getAllByText("Donated")).toHaveLength(1)
    })

    it("shows only the used legend when used is selected", async () => {
        await rednerDashboard()
        await screen.findByText("30 Items Donated (30.0%)")
        const usedTexts = screen.getAllByText("Used")
        await fireEvent.press(usedTexts[usedTexts.length -1])
        expect(screen.getAllByText("Used")).toHaveLength(2)
        expect(screen.getAllByText("Wasted")).toHaveLength(1)
        expect(screen.getAllByText("Donated")).toHaveLength(1)
    })

    it("shows only the donated legend when donated is selected", async () => {
        await rednerDashboard()
        await screen.findByText("30 Items Donated (30.0%)")
        const donatedTexts = screen.getAllByText("Donated")
        await fireEvent.press(donatedTexts[donatedTexts.length -1])
        expect(screen.getAllByText("Donated")).toHaveLength(2)
        expect(screen.getAllByText("Wasted")).toHaveLength(1)
        expect(screen.getAllByText("Used")).toHaveLength(1)
    })

    it("handles dashboard fetch errors", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
        global.fetch.mockRejectedValue(new Error("Network error"))
        await rednerDashboard()
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("Fetching error to dashboard route.", "Network error")
        })
    })
})