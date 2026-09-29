import React from "react";
import { Linking } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";

import DonationScreen from "../../app/(tabs)/donation";
import { getNearbyDonationLocations } from "../../services/giveFoodApi";
import { findDonationMatches, getNeedsStatus } from "../../utils/matchDonations";

jest.mock("../../services/giveFoodApi", () => ({
    getNearbyDonationLocations: jest.fn(),
}))

jest.mock("../../utils/matchDonations", () => ({
    findDonationMatches: jest.fn(),
    getNeedsStatus: jest.fn(),
}))

jest.mock("react-native-maps", () => {
    const React = require("react")
    const { View } = require("react-native")
    const MockMapView = React.forwardRef(
        ({ children }, ref) => {
            React.useImperativeHandle(ref, () => ({
                fitToCoordinates: jest.fn(),
            }))
            return <View testID="map">{children}</View>
        }
    )
    const MockMarker = () => <View testID="marker" />
    return {
        __esModule: true,
        default: MockMapView,
        Marker: MockMarker,
    }
})

describe("DonationsScreen", () => {
    beforeEach(async () => {
        jest.clearAllMocks()
        getNeedsStatus.mockReturnValue("available")
        findDonationMatches.mockReturnValue([])
        await render (<DonationScreen />)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it("renders the donation screen", () => {
        expect(screen.getByText("Find somewhere to donate.")).toBeTruthy()
        expect(screen.getByPlaceholderText("Enter postcode or location")).toBeTruthy()
        expect(screen.getByText("Search")).toBeTruthy()
    })

    it("shows an error when search is pressed without a postcode", async () => {
        await fireEvent.press(screen.getByText("Search"))
        expect(screen.getByText("Please enter a postcode!")).toBeTruthy()
        expect(getNearbyDonationLocations).not.toHaveBeenCalled()
    })

    it("searches for nearby donation locations", async () => {
        const mockLocations = [
            {
                id: "1",
                name: "Local Food Bank",
                address: "1 High Street",
                distance_mi: 2.5,
                lat_lng: "51.5,-0.1",
                needs: {
                    needs: "Milk\nBread",
                }
            }
        ]
        getNearbyDonationLocations.mockResolvedValue(mockLocations)
        await fireEvent.changeText(screen.getByPlaceholderText("Enter postcode or location"), "SE7 7HR")
        await fireEvent.press(screen.getByText("Search"))
        expect(getNearbyDonationLocations).toHaveBeenCalledWith("SE7 7HR")
        expect(await screen.findByText("Local Food Bank")).toBeTruthy()
        expect(screen.getByText("2.5 miles away")).toBeTruthy()
        expect(screen.getByText("1 High Street")).toBeTruthy()
    })

    it("shows an error when the donation location request fails", async () => {
        getNearbyDonationLocations.mockRejectedValue(new Error("Unable to find nearby donation locations"))
        await fireEvent.changeText(screen.getByPlaceholderText("Enter postcode or location"), "SE7 7HR")
        await fireEvent.press(screen.getByText("Search"))
        expect(await screen.findByText("Unable to find nearby donation locations")).toBeTruthy()
    })
})