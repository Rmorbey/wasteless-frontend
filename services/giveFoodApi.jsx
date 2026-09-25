const BASE_URL = "https://www.givefood.org.uk/api/2"

export async function getNearbyDonationLocations(postcode) {
    const response = await fetch(`${BASE_URL}/locations/search/?address=${encodeURIComponent(postcode)}`)
    if(!response.ok) {
        throw new Error("Unable to find nearby donation locations")
    }
    return response.json()    
}