import { Text, View, TextInput, FlatList, Pressable, Modal, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker'
import { ActivityIndicator } from "react-native";

export default function PantryScreen() {
    const [pantryItems, setPantryItems] = useState([
        {
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
        },
        {
            id: '4',
            name: 'Cheese',
            quantity: '1',
            expiry: '2026-10-03',
        },
        {
            id: '5',
            name: 'Carrot',
            quantity: '1',
            expiry: '2026-10-08',
        },
                {
            id: '6',
            name: 'Onion',
            quantity: '1',
            expiry: '2026-10-11',
        },
    ])

    const [manualFormVisible, setManualFormVisible] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [foodName, setFoodName] = useState('')
    const [quantity, setQuanity] = useState('')
    const [expiry, setExpiry] = useState('')

    const [scanning, setScanning] = useState(false)

    function handleAddFood(){
        if(!foodName || !expiry){
            Alert.alert(
                'Missing information.',
                'Please enter a food name and an expiry date.'
            )
            return
        }
        const newFood = {
            id: Date.now().toString(),
            name: foodName,
            quantity: quantity || '1',
            expiry: expiry,
        }
        setPantryItems((currentItems) => [
            ...currentItems,
            newFood,
        ])
        setFoodName('')
        setQuanity('')
        setExpiry('')
        setManualFormVisible(false)
    }

    async function handleScanReceiptPress() {

        setModalVisible(false)

        try {
            setScanning(true)

            const hostedImageUrl = 'https://i.ibb.co/LD3WskXw/PXL-20260925-141424333.jpg'

            const response = await fetch(`${BACKEND_URL}/scan-receipt`, {
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ imageUrl: hostedImageUrl })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed parsing receipt data values")
            }

            await fetchPantryFromBackend();

            Alert.alert("Success", "Receipt processed and items added to your pantry")
        } catch (error) {
            console.error(error)
            Alert.alert("OCR Error", "Failed to extract items. Ensure image is clear.")
        } finally {
            setScanning(false)
        }
    }

    function renderPantryItem({ item }){
        return (
            <View style={styles.foodCard}>
                <View>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodDetails}>Quantity: {item.quantity}</Text>
                </View>
                <View>
                    <Text style={styles.expiryLabel}>Expires:</Text>
                    <Text style={styles.expiryDate}>{item.expiry}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>

            {scanning && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size='large' color="#4CAF50" />
                    <Text style={styles.loadingText}>Reading Receipt...</Text>
                </View>
            )}

            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>My Pantry</Text>
                    <Text style={styles.subtitle}>{pantryItems.length} Items</Text>
                </View>
                <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.addButtonText}>+ Add Food</Text>
                </Pressable>
            </View>

            <FlatList
                data={pantryItems}
                renderItem={renderPantryItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.foodList}
                ListEmptyComponent={<Text style={styles.emptyText}>Your pantry is empty!</Text>}
            />
            <Modal 
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            {!manualFormVisible ? (
                                <>
                                <Text style={styles.modalTitle}>
                                    Add Food.
                                </Text>
                                <Pressable style={styles.optionButton} onPress={() => setManualFormVisible(true)}>
                                    <Text style={styles.optionTitle}>
                                        Add Manually.
                                    </Text>
                                    <Text style={styles.optionDescription}>
                                        Enter an item, quanity and expiry date.
                                    </Text>
                                </Pressable>

                                <Pressable style={[styles.optionButton, { marginTop: 12 }]} onPress={handleScanReceiptPress}>
                                    <Text style={styles.optionTitle}>Scan Receipt.</Text>
                                    <Text style={styles.optionDescription}>
                                        Select a photo of your grocery receipt.
                                    </Text>
                                </Pressable>

                                <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.cancelText}>
                                        Cancel
                                    </Text>
                                </Pressable>
                                </>
                            ) : (
                                <>
                                <Text style={styles.modalTitle}>
                                    Add Food
                                </Text>
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="food name" 
                                    value={foodName} 
                                    onChangeText={setFoodName} 
                                />
                                <TextInput
                                    style={styles.input} 
                                    placeholder="quantity" 
                                    value={quantity} 
                                    onChangeText={setQuanity} 
                                />
                                <TextInput
                                    style={styles.input} 
                                    placeholder="expiry date(YYYY-MM-DD)" 
                                    value={expiry} 
                                    onChangeText={setExpiry}
                                />
                                <Pressable style={styles.saveButton} onPress={handleAddFood}>
                                    <Text style={styles.saveButtonText}>
                                        Add to pantry
                                    </Text>
                                </Pressable>
                                <Pressable style={styles.cancelButton} onPress={() => setManualFormVisible(false)}>
                                    <Text style={styles.cancelText}>
                                        Back
                                    </Text>
                                </Pressable>
                                </>
                            )}
                        </View>
                    </View>
            </Modal>
        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#777',
        marginTop: 4,
    },
    addButton: {
        backgroundColor: '#2f855a',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 10,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',

    },
    foodList: {
        gap: 12,
    },
    foodCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    foodName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    foodDetails: {
        color: '#666',
        marginTop: 5,
    
    },
    expiryLabel: {
        fontSize: 12,
        color: '#777'
    },
    expiryDate: {
        marginTop: 3,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#777',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 25,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 18,
        borderRadius: 12,
        marginBottom: 12,
    },
    optionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    optionDescription: {
        color: '#777',
        marginTop: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
    },
    saveButton: {
        backgroundColor: '#2f855a',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 15,
        alignItems: 'center',
    },
    cancelText: {
        color: '#666'
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    loadingText: {
        marginTop: 14,
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
})
