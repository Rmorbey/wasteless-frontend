import { Text, View, StyleSheet, ScrollView, Pressable  } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useMemo } from "react";
import { TWPallet } from "../../constants/TWPallet";
import { generateMonthlyData } from "../../constants/DummyData";
import { Ionicons } from '@expo/vector-icons';

const colorThemes = {
    blue: { name: 'blue', primary: 500, accent: 600 },
    purple: { name: 'purple', primary: 500, accent: 600 },
    emerald: { name: 'emerald', primary: 500, accent: 600 },
    orange: { name: 'orange', primary: 500, accent: 600 },
    pink: { name: 'pink', primary: 500, accent: 600 },
    cyan: { name: 'cyan', primary: 500, accent: 600 },
}

export default function DashboardScreen() {
    const [selectedBarIndex, setSelectedBarIndex] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

    const [colorTheme, setColorTheme] = useState('emerald')

    const theme = colorThemes[colorTheme]
    const themeColor = TWPallet[theme.name]

    const bgColors = [
        TWPallet[theme.name][100],
        "#ffffff",
        TWPallet[theme.name][100],
    ]

    const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }]

    const getMonthName = (month) => {
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ]
        return months[month]
    }

    const navigateMonth = (direction) => {
        let newMonth = currentMonth + direction
        let newYear = currentYear

        if (newMonth > 11) {
            newMonth = 0
            newYear++
        } else if (newMonth < 0) {
            newMonth = 11
            newYear--
        }

        setCurrentMonth(newMonth)
        setCurrentYear(newYear)
        setSelectedBarIndex(null)
    }

    const monthlyData = useMemo(
        () => generateMonthlyData(currentYear, currentMonth),
        [currentYear, currentMonth]
    )

    const getChartData = () => {
        return monthlyData.map((item, index) => ({
            ...item,
            topLabelComponent: () => 
                selectedBarIndex === index ? (
                    <Text 
                    style={{
                        color: themeColor[700],
                        fontSize: 10,
                        fontWeight: '600',
                        marginBottom: 4,
                    }}
                    >
                        {item.value}
                    </Text>
                ) : null
        }))
    }

    return (
        <LinearGradient style={{ flex: 1 }} colors={bgColors}>
            <ScrollView contentInsetAdjustmentBehavior='automatic'>
                <View 
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                    paddingHorizontal: 16,
                }}
                >
                    <Pressable
                        onPress={() => navigateMonth(-1)}
                        style={{
                            padding: 8,
                            borderRadius: 8,
                        }}
                        hitSlop={20}
                    >
                        <Ionicons
                            name={"chevron-back"}
                            size={16}
                            color={TWPallet.slate[500]}
                        />
                    </Pressable>

                    <Text 
                        style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: TWPallet.slate[900],
                        }}
                    >
                        {getMonthName(currentMonth)} {currentYear}
                    </Text>

                    <Pressable
                        onPress={() => navigateMonth(1)}
                        style={{
                            padding: 8,
                            borderRadius: 8,
                        }}
                        hitSlop={20}
                    >
                        <Ionicons
                            name={"chevron-forward"}
                            size={16}
                            color={TWPallet.slate[500]}
                        />
                    </Pressable>
                </View>
                <BarChart 
                data={getChartData()}
                noOfSections={4}
                barBorderRadius={4}
                yAxisThickness={0}
                xAxisThickness={0}
                showGradient
                gradientColor={TWPallet[theme.name][500]}
                frontColor={TWPallet[theme.name][300]}
                xAxisLabelTextStyle={{
                    color: TWPallet.slate[400],
                    fontSize: 12,
                    fontWeight: '500',
                }}
                yAxisTextStyle={{
                    color: TWPallet.slate[400],
                    fontSize: 12,
                    fontWeight: '500',
                }}
                dashGap={10}
                showXAxisIndices={false}
                onPress={(_item, index) => {
                    setSelectedBarIndex(selectedBarIndex === index ? null : index)
                }}
                />

                <View style={{paddingHorizontal: 16}}>
                    <Text style={[styles.subtitle, {marginBottom: 16}]}>
                        Choose Theme
                    </Text>

                    <View style={{ flexDirection: 'row', gap: 16}}>
                        {Object.keys(colorThemes).map((theme) => (
                            <Pressable 
                            key={theme}
                            onPress={() => setColorTheme(theme)}
                            style={{ 
                                backgroundColor:
                                    TWPallet[colorThemes[theme].name][500],
                                width: 30,
                                height: 30,
                                borderRadius: 16,
                                borderWidth: colorTheme === theme ? 3 : 0,
                                borderColor: 'white',
                                boxShadow:
                                    colorTheme === theme
                                    ? "0px 2px 8px rgba(0,0,0,0.2)"
                                    : "none",
                            }}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: TWPallet.slate[900],
    },
    subtitle: {
        fontSize: 16,
        color: TWPallet.slate[600],
    },
    label: {
        fontSize: 14,
        color: TWPallet.slate[600],
    }
})
