import { getNeedsStatus, findDonationMatches } from "../../utils/matchDonations";

describe("getNeedsStatus", () => {
    it("returns unknown when needsString is missing", () => {
        expect(getNeedsStatus()).toBe("unknown")
        expect(getNeedsStatus("")).toBe("unknown")
    })

    it("returns unknown for unknown and facebook", () => {
        expect(getNeedsStatus("unknown")).toBe("unknown")
        expect(getNeedsStatus("facebook")).toBe("unknown")
    })

    it("returns nothing for nothing", () => {
        expect(getNeedsStatus("nothing")).toBe("nothing")
    })

    it("return available for a vaild needs list", () => {
        expect(getNeedsStatus("Pasta\nRice\nBeans")).toBe("available")
    })

    it("ignores capital letters and extra whitespace", () => {
        expect(getNeedsStatus("  UNKNOWN  ")).toBe("unknown")
        expect(getNeedsStatus("  FACEBOOK  ")).toBe("unknown")
        expect(getNeedsStatus("  NOTHING  ")).toBe("nothing")
    })
})

describe("findDonationMatches", () => {
    const pantryItems = [
        { id: "1", name: "Milk" },
        { id: "2", name: "Pasta" },
        { id: "3", name: "Tinned Beans" },
        { id: "4", name: "Rice" },
    ]

    it("returns matching pantry items", () => {
        const needsString = "Pasta\nRice"
        const result = findDonationMatches(pantryItems, needsString)
        expect(result).toEqual([
            { id: "2", name: "Pasta" },
            { id: "4", name: "Rice" },
        ])
    })

    it("returns an empty array when needs are unknown, facebook or nothing", () => {
        expect(findDonationMatches(pantryItems, "unknown")).toEqual([])
        expect(findDonationMatches(pantryItems, "facbook")).toEqual([])
        expect(findDonationMatches(pantryItems, "nothing")).toEqual([])
    })

    it("reurn an empty array when there are no matches", () => {
        const result = findDonationMatches(pantryItems, "Cereal\nTea")
        expect(result).toEqual([])
    })

    it("matches items after removing quantities and regardless of capitalisation", () => {
        const result = findDonationMatches(pantryItems, "500g PASTA")
        expect(result).toEqual([{ id: "2", name: "Pasta" }])
    })

    it("matches when one item name contains the other", () => {
        const result = findDonationMatches(pantryItems, "Beans")
        expect(result).toEqual([{ id: "3", name: "Tinned Beans" }])
    })
})