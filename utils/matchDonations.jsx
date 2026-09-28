export function getNeedsStatus(needsString) {
    if (!needsString) {
        return "unknown"
    }
    const value = needsString.trim().toLowerCase()
    if (value === "unknown") {
        return "unknown"
    }
    if (value === "facebook") {
        return "unknown"
    }
    if (value === "nothing") {
        return "nothing"
    }
    return "available"
}

function normalizeItem(item) {
    return item
        .toLowerCase()
        .replace(/[0-9]+(g|kg|ml|l)?/g, "")
        .replace(/[^\w\s]/g, "")
        .trim()
}

function itemsMatch(pantryItem, neededItem) {
    const pantry = normalizeItem(pantryItem)
    const needed = normalizeItem(neededItem)
    return pantry.includes(needed) || needed.includes(pantry)
}

export function findDonationMatches(pantryItems, needsString) {
    const status = getNeedsStatus(needsString)
    if (status !== "available") {
        return []
    }
    const neededItems = needsString
        .split("\n")
        .map(item => item.trim())
        .filter(Boolean)

    return pantryItems.filter(pantryItem => neededItems.some(neededItem => itemsMatch(pantryItem.name, neededItem)))
}