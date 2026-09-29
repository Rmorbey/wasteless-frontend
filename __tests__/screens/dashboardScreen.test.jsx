import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

import DashboardScreen from "../../app/(tabs)/dashboard";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "react-native-svg";

const mockLineChart = jest.fn()
jest.mock("react-native-gifted-charts", () => {
    const { View } = require("react-native");
    return {
        LineChart: (props) => {
            mockLineChart(props)
            return <View testID="line-chart" />
        }
    }
})

jest.mock("expo-linear-gradient", () => {
    const { View } = require("react-native")
    return {
        LinearGradient: ({ children }) => (
            <View>{children}</View>
        )
    }
})

jest.mock("@expo/vector-icons", () => {
    const { Text } = require("react-native")
    return {
        Ionicons: ({ name }) => (
            <Text testID={`icon-${name}`}>
                {name}
            </Text>
        ),
    }
})

describe("DashboardScreen", () => {
    beforeEach(async () => {
        jest.clearAllMocks()
        jest.useFakeTimers()
        jest.setSystemTime(new Date("2026-09-15T12:00:00"))
        await render(<DashboardScreen />)
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    it("renders the dashboard content", () => {
        expect(screen.getByText("Food Inventory Trends")).toBeTruthy()
        expect(screen.getByText("Hardcoded: 24 meals")).toBeTruthy()
        expect(screen.getByText("Hardcoded: 82%")).toBeTruthy()
        expect(screen.getByText("Hardcoded: 1.4kg")).toBeTruthy()
        expect(screen.getByText("Hardcoded: Waste Insights")).toBeTruthy()
    })
})