import { Text, View, TextInput, Pressable, FlatList, ActivityIndicator, StyleSheet, Linking } from "react-native";
import { useState, useEffect, useRef } from "react";
import MapView, { Marker } from 'react-native-maps'
import { getNearbyDonationLocations } from "../../services/giveFoodApi";
import { findDonationMatches, getNeedsStatus } from "../../utils/matchDonations";

export default function DonationScreen() {
    const [postcode, setPostcode] = useState('')
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const mapRef = useRef(null)

    const mockPantryItems = [{
            id: '1',
            name: 'Milk',
            quantity: '1',
            expiry: '2026-09-27',
        },
        {
            id: '2',
            name: 'Eggs',
            quantity: '6',
            expiry: '2026-10-01',
        },
        {
            id: '3',
            name: 'Bread',
            quantity: '1',
            expiry: '2026-09-28',
        }]

    async function handleSearch() {
        if (!postcode.trim()){
            setError('Please enter a postcode!')
            return
        }
        try {
            setLoading(true)
            setError('')

            const data = await getNearbyDonationLocations(postcode)
            
            setLocations(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    function getCoordinates(location){
        if (!location.lat_lng){
            return null
        }
        const [latitude, longitude] = location.lat_lng
        .split(',')
        .map(Number)

        return {latitude, longitude}
    }

    useEffect(() => {
        if (!locations.length || !mapRef.current) {
            return
        }

        const coordinates = locations
        .map(getCoordinates)
        .filter(Boolean)

        if(!coordinates.length){
            return
        }

        mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: {
                top: 50,
                right: 50,
                bottom: 50,
                left: 50
            },
            animated: true,
        })
    }, [locations])

    async function openFoodBankLink(url) {
        if (!url) {
            return
        }
        const supported = await Linking.canOpenURL(url)
        if (supported) {
            await Linking.openURL(url)
        }
    }

    function renderLocation({ item }){
        const needsString = item.needs?.needs || ""
        const needsStatus = getNeedsStatus(needsString)
        const matches = findDonationMatches(mockPantryItems, needsString)
        const needs = needsStatus === "available" ? needsString.split('\n').filter(Boolean) : []

        return ( 
            <View style={styles.card}>
                <Text style={styles.foodBankName}>
                    {item.foodbank?.name || item.name}
                </Text>
                <Text style={styles.distance}>
                    {item.distance_mi ? `${item.distance_mi} miles away` : ''}
                </Text>
                {item.address && (
                    <Text style={styles.address}>
                        {item.address}
                    </Text>
                )}
                <Text style={styles.sectionTitle}>
                    Currently needed
                </Text>
                {needsStatus === "available" && (
                    <>
                        {needs.map(
                            (need, index) => (
                                <Text key={index}>
                                    • {need}
                                </Text>
                            )
                        )}
                    </>
                )}
                {needsStatus === "unknown" && (
                    <View style={styles.unavailableBox}>
                        <Text style={styles.unavailableTitle}>
                            Current donation needs aren't available.
                        </Text>
                        <Text style={styles.unavailableText}>
                            Check the food bank's latest information before donating.
                        </Text>
                        {item.fallbackUrl && (
                            <Pressable style={styles.linkButton} onPress={() => openFoodBankLink(item.fallbackUrl)}>
                                <Text style={styles.linkButtonText}>
                                    View latest information
                                </Text>
                            </Pressable>
                        )}
                    </View>
                )}

                {needsStatus === "nothing" && (
                    <View style={styles.unavailableBox}>
                        <Text style={styles.unavailableTitle}>
                            No items currently listed as needed.
                        </Text>
                        <Text style={styles.unavailableText}>
                            Check with the food bank before making a donation.
                        </Text>
                    </View>
                )}

                {needsStatus === "available" && matches.length > 0 && (
                    <View style={styles.matchBox}>
                        <Text style={styles.matchTitle}>
                            You can donate{" "} {matches.length}{" "}
                            {matches.length === 1 ? 'item' : 'items'}
                        </Text>
                        {matches.map(item => (
                            <Text key={item.id}>
                               + {item.name}
                            </Text>
                        ))}
                    </View>
                )}
                {needsStatus === "available" && matches.length === 0 && (
                   <Text style={styles.noMatch}>
                        No pantry matches found
                    </Text> 
                )}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Find somewhere to donate.
            </Text>
            <Text style={styles.subtitle}>
                Enter your postcode or location to find nearby foodbanks 
                and see what you can donate from your pantry.
            </Text>

            <View style={styles.searchContainer}>
                <TextInput 
                    style={styles.input}
                    value={postcode} 
                    onChangeText={setPostcode}
                    placeholder="Enter postcode or location"
                    autoCapitalize="characters"
                />

                <Pressable style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>
                        Search
                    </Text>
                </Pressable>
            </View>

            {error && (
                <Text style={styles.error}>
                    {error}
                </Text>
            )}
            {loading && (
                <ActivityIndicator size='large' />
            )}

            {locations.length > 0 && (
                <> 
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={{ 
                            latitude: 54.5,
                            longitude: -3,
                            latitudeDelta: 8,
                            longitudeDelta: 8,
                        }}
                    >
                        {locations.map((location) => {
                            const coordinates = getCoordinates(location)
                            if(!coordinates){
                                return null
                            }
                            const needsString = location.needs?.needs || ""
                            const status = getNeedsStatus(needsString)
                            const matches = findDonationMatches(mockPantryItems, needsString)
                            let description = "View donation needs"
                            if (status === "unknown") {
                                description = "Current needs unavailable"
                            } else if (status === "nothing") {
                                description = "No current items listed"
                            } else if (matches.legnth > 0) {
                                description = `${matches.length} pantry items match`
                            }
                            return (
                                <Marker
                                    key={location.id}
                                    coordinate={coordinates}
                                    title={location.foodbank?.name || location.name}
                                    description={description}
                                />
                            )
                        })}
                    </MapView>
                    <Text style={styles.nearbyTitle}>
                        Nearby donation locations
                    </Text>
                    <FlatList
                        data={locations}
                        keyExtractor={item => String(item.id)}
                        renderItem={renderLocation}
                        contentContainerStyle={{paddingBottom: 40}}

                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 6
    },
    subtitle: {
        fontSize: 15,
        marginBottom: 6
    },
    searchContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal:12,
        paddingVertical: 10
    },
    searchButton: {
        backgroundColor: '#333',
        paddingHorizontal: 18,
        justifyContent: 'center',
        borderRadius: 10
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    map: {
        width: '100%',
        height: 260,
        borderRadius: 12,
        marginBottom: 18
    },
    nearbyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12
    },
    foodBankName: {
        fontSize: 19,
        fontWeight: 'bold'
    },
    distance: {
        marginTop: 3,
        opacity: 0.7
    },
    address: {
        marginTop: 5,
        marginBottom: 12
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    matchBox: {
        marginTop: 14,
        padding: 12,
        backgroundColor: '#eee',
        borderRadius: 10
    },
    matchTitle: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    noMatch: {
        marginTop: 10,
        opacity: 0.6
    },
    unavailableBox: {
        padding: 12,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10
    },
    unavailableTitle: {
        fontWeight: 'bold',
        marginBottom: 4
    },
    unavailableText: {
        marginBottom: 10
    },
    linkButton: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center'
    },
    linkButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    error: {
        marginBottom: 10
    }
})
