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