import { Text, View, TextInput, Pressable, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useState, useEffect, useRef } from "react";
import MapView, { Marker } from 'react-native-maps'

export default function DonationScreen() {
    const [postcode, setPostcode] = useState('')
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const mapRef = useRef(null)

    const mockPantryItems = ['Milk', 'Bread', 'Beans', 'Tomatoes']

    async function handleSearch(postcode) {
        if (!postcode.trim()){
            setError('Please enter a postcode!')
            return
        }
        try {
            setLoading(true)
            setError('')

            const response = await fetch(`https://www.givefood.org.uk/api/2/locations/search/?address=${postcode}`)
            const data = await response.json()

            setLocations(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    function getCordinates(location){
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

        const cordinates = locations
        .map(getCordinates)
        .filter(Boolean)

        if(!cordinates.length){
            return
        }

        mapRef.current.fitToCordinates(cordinates, {
            edgePadding: {
                top: 50,
                right: 50,
                bottom: 50,
                left: 50
            },
            animated: true,
        })
    }, [locations])

    function renderLocation({ item }){
        const needsString = item.needs?.needs || ""
        const matches = mockPantryItems.filter(item => needsString.toLowerCase().includes(item.toLowerCase()))
        const needs = needsString.split('\n').filter(Boolean)

        return ( 
            <View>
                <Text>
                    {item.foodbank?.name || item.name}
                </Text>
                <Text>
                    {item.distance_mi ? `${item.distance_mi} miles away` : ''}
                </Text>
                <Text>
                    Currently needed
                </Text>
                {needs.slice(0, 5).map((need, index) => (
                    <Text key={index}>
                        • {need}
                    </Text>
                ))}
                {matches.length > 0 ? (
                    <View>
                        <Text>
                            You can donate {matches.length}{" "}
                            {matches.length === 1 ? 'item' : 'items'}
                        </Text>
                        {matches.map(item => (
                            <Text key={item.id}>
                               + {item.name}
                            </Text>
                        
                        ))}
                    </View>
                ) : (
                    <Text>
                        No pantry matches found
                    </Text>
                ) }
            </View>
        )
    }

    return (
        <View>
            <Text>
                Find somewhere to donate.
            </Text>
            <Text>
                Enter your postcode or location to find nearby foodbanks and see what you can donate from your pantry.
            </Text>

            <View>
                <TextInput 
                    value={postcode} 
                    oncChangeText={setPostcode}
                    placeholder="Enter postcode or location"
                    autoCapitalize="characters"
                />

                <Pressable onPress={handleSearch}>
                    <Text>
                        Search
                    </Text>
                </Pressable>
            </View>

            {error && (
                <Text>
                    {error}
                </Text>
            )}
            {loading && (
                <ActivityIndicator
                    size='large'
                />
            )}
            {locations.length > 0 && (
                <> 
                    <MapView
                        ref={mapRef}
                        initialRegion={{ 
                            latitude: 54.5,
                            longitude: -3,
                            latitudeDelta: 8,
                            longitudeDelta: 8,
                        }}
                    >
                        {locations.map((location) => {
                            const cordinates = getCordinates(location)
                            if(!cordinates){
                                return null
                            }
                            const matches = findDonationMatches(
                                pantryItems,
                                location.needs?.needs
                            )
                            return (
                                <Marker
                                    key={location.id}
                                    coordinate={cordinates}
                                    title={location.foodbank?.name || location.name}
                                    description={matches.length ? `${matches.length} pantry items match` : 'view donation needs'}
                                />
                            )
                        })}
                    </MapView>
                    <Text>
                        Nearby donation locations
                    </Text>
                    <FlatList
                        data={locations}
                        keyExtractor={item => item.id}
                        renderItem={renderLocation}
                        contentContainerStyle={{paddingBottom: 40}}

                    />
                </>
            )}
        </View>
    );
}
