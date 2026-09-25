const BASE_URL = "https://www.givefood.org.uk/api/2"

export async function getNearbyDonationLocations(postcode) {
    const response = await fetch(`${BASE_URL}/locations/search/?address=${encodeURIComponent(postcode)}`)
    if(!response.ok) {
        throw new Error("Unable to find nearby donation locations")
    }
    const locations = await response.json()
    const fiveLocations = locations.slice(0, 5)

    const enrichedLocations = await Promise.all(fiveLocations.map(async (location) => {
        const needsValue = location.needs?.needs?.trim().toLowerCase()
        const needsUnavailable = !needsValue || needsValue === "unknown" || needsValue === "facebook"
        if (!needsUnavailable) {
            return location
        }
        const foodbankApiUrl = location.foodbank?.urls?.self
        if (!foodbankApiUrl) {
            return location
        }
        try {
            const foodbankResponse = await fetch(foodbankApiUrl)
            if (!foodbankResponse.ok) {
                return location
            }
            const foodbankDetails = await foodbankResponse.json()
            const fallbackUrl = 
                foodbankDetails.urls?.shopping_list ||
                foodbankDetails.urls?.homepage || 
                foodbankDetails.urls?.html || 
                location.foodbank?.urls?.html
            return {
                ...location, fallbackUrl: fallbackUrl
            }
        } catch (error) {
            console.log("Unable to get extra food bank information:", error);
            return location
        }
    }))
    return enrichedLocations
}