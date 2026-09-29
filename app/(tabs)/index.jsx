import { Text, View, TextInput, FlatList, Pressable, Modal, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker'
import { usePantry } from "./_layout";
import { useAuth } from "../_layout";
import { Ionicons } from "@expo/vector-icons";
import { pantryStyles as styles } from "../../constants/PantryStyles";

export default function PantryScreen() {
    const { pantryItems, fetchPantryFromBackend } = usePantry()
    const { token, userId } = useAuth()

    const [manualFormVisible, setManualFormVisible] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [foodName, setFoodName] = useState('')
    const [quantity, setQuanity] = useState('')
    const [scanning, setScanning] = useState(false)
    const [date, setDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    
    const API_URL = "http://4.225.221.72";
    const local_URL = 'http://localhost'

    async function handleAddFood(){


        if(!foodName){
            Alert.alert(
                'Missing information.',
                'Please enter a food name and an expiry date.'
            )
            return
        }

        try {
            const response = await fetch(`${local_URL}/pantry`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: foodName,
                    quantity: parseInt(quantity) || 1,
                    user_id: userId,
                    expiry_date: date,
                })
            })

            const data = await response.json()

            if(!response.ok) {
                throw new Error(data.error || "Failed to add item to pantry.")
            }
            console.log('user id: ', userId)
            
            await fetchPantryFromBackend()

            setFoodName('')
            setQuanity('')
            setDate(new Date())
            setManualFormVisible(false)
            setModalVisible(false)

            Alert.alert("Success", `${foodName} added to your pantry.`)
        } catch (error) {
            console.error('Manual add food failed:', error.message)
            Alert.alert('Error', 'Could not add item to server.')
        }
    }

    async function handleScanReceiptPress() {

        setModalVisible(false)

        try {
            setScanning(true)

            const hostedImageUrl = 'https://i.ibb.co/LD3WskXw/PXL-20260925-141424333.jpg'

            const response = await fetch(`${local_URL}/scan-receipt`, {
                method: 'POST',
                headers: { 
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`
                },
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
            Alert.alert("Scanning Error", "Failed to extract items. Ensure image is clear.")
        } finally {
            setScanning(false)
        }
    }

    function renderPantryItem({ item }){
        const formattedDate = item.expiry_date ? item.expiry_date.split('T')[0] : ''
        return (
            <View style={styles.foodCard}>
                <View style={styles.cardMainContent}>
                    <Text style={styles.foodName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                    <Text style={styles.foodDetails}>Quantity: {item.quantity}</Text>
                </View>
                <View style={styles.cardExpiryColumn}>
                    <Text style={styles.expiryLabel}>Expires:</Text>
                    <Text style={styles.expiryDate}>{formattedDate}</Text>
                </View>
            </View>
        )
    }

    const availablePantryItems = pantryItems.filter(item => item.status === 'available')

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
                    <Text style={styles.subtitle}>{availablePantryItems.length} Items</Text>
                </View>
                <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.addButtonText}>+ Add Food</Text>
                </Pressable>
            </View>

            <FlatList
                data={availablePantryItems}
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
                                <Pressable 
                                    style={styles.datePickerSelectorButton} 
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text style={styles.datePickerSelectorText}>
                                        {date.toISOString().split('T')[0]}
                                    </Text>
                                    <Ionicons name="calendar-outline" size={18} color='#666'/>
                                </Pressable>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display={Platform.OS == 'ios' ? 'inline' : 'default'}
                                        minimumDate={new Date()}
                                        onValueChange={(event, selectedDate) => {
                                            setShowDatePicker(false)
                                            if (selectedDate) {
                                                setDate(selectedDate)
                                            }
                                        }}
                                    />
                                )}
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
