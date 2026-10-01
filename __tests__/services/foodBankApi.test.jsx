import { getNearbyDonationLocations } from "../../services/giveFoodApi";

describe("getNearbyDonationLocations", () => {
    beforeEach(() => {
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("fetches nearby donation locations using the postcode", async () => {
        const mockLocations = [{
            name: "food bank 1",
            needs: {
                needs: "pasta",
            },
        },]
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockLocations,
        })
        const result = await getNearbyDonationLocations("SE7 7HR")
        expect(global.fetch).toHaveBeenCalledWith("https://www.givefood.org.uk/api/2/locations/search/?address=SE7%207HR")
        expect(result).toEqual(mockLocations)
    })

    it("throws an error when the locations request fails", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
        })
        await expect(getNearbyDonationLocations("SE7 7HR")).rejects.toThrow("Unable to find nearby donation locations")
    })

    it("only returns the first five locations", async () => {
        const mockLocations = [
            { name: "location 1", needs: { needs: "pasta" } },
            { name: "location 2", needs: { needs: "rice" } },
            { name: "location 3", needs: { needs: "milk" } },
            { name: "location 4", needs: { needs: "bread" } },
            { name: "location 5", needs: { needs: "cereal" } },
            { name: "location 6", needs: { needs: "tea" } },
        ]
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockLocations,
        })
        const result = await getNearbyDonationLocations("SE7 7HR")
        expect(result).toHaveLength(5)
        expect(result[0].name).toBe("location 1")
        expect(result[4].name).toBe("location 5")
    })

    it("returns a location unchanged when needs information is available", async () => {
        const mockLocation = {
            name: "Food Bank",
            needs: {
                needs: "Pasta, rice and beans",
            },
            foodbank: {
                urls: {
                    self: "https://example.com/foodbank",
                },
            },
        }
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [mockLocation],
        })
        const result = await getNearbyDonationLocations("SE7 7HR")
        expect(result[0]).toEqual(mockLocation)
        expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it("fetches food bank details when needs are unknown", async () => {
        const mockLocation = {
            name: "Food Bank",
            needs: {
                needs: "unknown",
            },
            foodbank: {
                urls: {
                    self: "https://example.com/foodbank-api",
                    html: "https://example.com/foodbank",
                },
            },
        }
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [mockLocation],
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                urls: {
                    shopping_list: "https://example.com/shopping-list",
                },
            }),
        })
        const result = await getNearbyDonationLocations("SE7 7HR")
        expect(global.fetch).toHaveBeenCalledTimes(2)
        expect(global.fetch).toHaveBeenNthCalledWith(2, "https://example.com/foodbank-api")
        expect(result[0]).toEqual({
            ...mockLocation,
            fallbackUrl: "https://example.com/shopping-list",
        })
    })
    it("returns the original location when the food bank details request fails", async () => {
        const mockLocation = {
            name: "Food Bank",
            needs: {
                needs: "unknown",
            },
            foodbank: {
                urls: {
                    self: "https://example.com/foodbank-api",
                },
            },
        }
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [mockLocation],
        })
        .mockResolvedValueOnce({
            ok: false,
        })
        const result = await getNearbyDonationLocations("SE7 7HR")
        expect(result[0]).toEqual(mockLocation)
    })

    it("returns the original location when no foodbank self url exists", async () => {
        const mockLocation = {
            name: "Food Bank",
            needs: {
                needs: "unknown",
            },
            foodbank: {
                urls: {},
            },
        }
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [mockLocation],
        })
        const result = await getNearbyDonationLocations("SE7 7HR")
        expect(result[0]).toEqual(mockLocation)
        expect(global.fetch).toHaveBeenCalledTimes(1)
    })
})