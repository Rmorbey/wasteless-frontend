import { Text, View, ScrollView, Pressable } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { dashboardStyles as styles } from "../../constants/DashboardStyles";
import { useAuth } from '../_layout'

export default function DashboardScreen() {
    const { token } = useAuth()
    const [activeFilter, setActiveFilter] = useState("all");

    const [rawData, setRawData] = useState(null)
    const [loading, setLoading] = useState(false)

    const [ wastedData, setWastedData] = useState([{ value: 0, label: "" }])
    const [ usedData, setUsedData] = useState([{ value: 0, label: "" }])
    const [ donatedData, setDonatedData] = useState([{ value: 0, label: "" }])

    const bgColors = ["#f8fafc", "#ffffff", "#f8fafc"];

    const API_URL = "http://4.225.221.72";
    const local_URL = 'http://localhost'

    const formatMonthLabel = (yearMonthStr) => {
        const [_, monthStr] = yearMonthStr.split('-')
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const index = parseInt(monthStr, 10) - 1
        return months[index] || monthStr
    }

    const fetchAnalytics = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${local_URL}/dashboard`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await response.json()

            if (response.ok){
                setRawData(data)
                processChartData(data)
            }
        } catch (error) {
            console.error("Fetching error to dashboard route.", error.message)
        } finally {
            setLoading(false)
        }
    }

    const processChartData = (data) => {
        if (!data || !data.monthly_analysis) return

        const monthsTimeLine = data.monthly_analysis

        const wastedMetrics = monthsTimeLine.map(m => ({
            value: m.wasted,
            label: formatMonthLabel(m.year_month)
        }))

        const usedMetrics = monthsTimeLine.map(m => ({
            value: m.used,
            label: formatMonthLabel(m.year_month)
        }))

        const donatedMetrics = monthsTimeLine.map(m => ({
            value: m.donated,
            label: formatMonthLabel(m.year_month)
        }))

        setWastedData(wastedMetrics)
        setUsedData(usedMetrics)
        setDonatedData(donatedMetrics)
    }

    useEffect(() => {
        fetchAnalytics()
    }, [token])


    const getActiveDataSet = () => {
        const showWasted = activeFilter === "all" || activeFilter === "wasted";
        const showUsed = activeFilter === "all" || activeFilter === "used";
        const showDonated = activeFilter === "all" || activeFilter === "donated";

        return [
            {
                data: wastedData,
                color: showWasted ? "#ef4444" : "transparent",
                dataPointsColor: showWasted ? "#ef4444" : "transparent",
            },
            {
                data: usedData,
                color: showUsed ? "#10b981" : "transparent",
                dataPointsColor: showUsed ? "#10b981" : "transparent",
            },
            {
                data: donatedData,
                color: showDonated ? "#3b82f6" : "transparent",
                dataPointsColor: showDonated
                    ? "#3b82f6"
                    : "transparent",
            },
        ];
    };

    const totalDonated = rawData ? rawData.total_donated : 0
    const totalUsed = rawData ? rawData.total_used : 0
    const totalWasted = rawData ? rawData.total_wasted : 0

    const donatedPercent = rawData ? parseFloat(rawData.donated_percentage) : 0
    const usedPercent = rawData ? parseFloat(rawData.used_percentage) : 0
    const wastedPercent = rawData ? parseFloat(rawData.wasted_percentage) : 0

    const efficiencyPercentage = Math.round(donatedPercent + usedPercent)
    const totalWastePercentage = Math.round(wastedPercent)

    const estimatedMeals = Math.round((totalDonated * 2) / 3)

    return (
        <LinearGradient style={{ flex: 1 }} colors={bgColors}>
            <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 32 }}>
                <View style={styles.headerRow}>
                    <View />
                        <Text style={styles.headerTitle}>Overview Analytics (2026)</Text>
                    <View />
                </View>

                <View style={[ styles.card, { marginHorizontal: 16, marginBottom: 16 }]}>
                    <Text style={styles.cardTitle}>Food Inventory Trends</Text>

                    <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
                        {(activeFilter === "all" || activeFilter === "wasted") && (
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                <View style={{ width: 10,height: 10, borderRadius: 5, backgroundColor: "#ef4444", }}/>
                                <Text style={{ fontSize: 12, color: "#475569", fontWeight: "600" }}>
                                    Wasted
                                </Text>
                            </View>
                        )}
                        {(activeFilter === "all" || activeFilter === "used") && (
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#10b981" }}/>
                                <Text style={{ fontSize: 12, color: "#475569", fontWeight: "600" }}>
                                    Used
                                </Text>
                            </View>
                        )}
                        {(activeFilter === "all" || activeFilter === "donated") && (
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#3b82f6" }}/>
                                <Text style={{ fontSize: 12, color: "#475569", fontWeight: "600" }}>
                                    Donated
                                </Text>
                            </View>
                        )}
                    </View>

                    <LineChart
                        dataSet={getActiveDataSet()}
                        thickness={3}
                        dataPointsSize={6}
                        dataPointsRadius={3}
                        noOfSections={4}
                        yAxisThickness={0}
                        xAxisThickness={1}
                        xAxisColor={"#e2e8f0"}
                        xAxisLabelTextStyle={{
                            color: "#94a3b8",
                            fontSize: 11,
                        }}
                        yAxisTextStyle={{
                            color: "#94a3b8",
                            fontSize: 11,
                        }}
                        height={160}
                        animateOnDataChange={false}
                    />

                    <View style={styles.filterButtonGroup}>
                        <Pressable onPress={() => setActiveFilter("all")} 
                        style={[ styles.filterButton, activeFilter === "all" && { backgroundColor: "#eab308" }]}>
                            <Text style={[ styles.filterButtonText, activeFilter === "all" && { color: "#fff" } ]}>
                                All
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => setActiveFilter("wasted")}
                            style={[ styles.filterButton, activeFilter === "wasted" && { backgroundColor: "#ef4444" }]}>
                            <Text style={[styles.filterButtonText, activeFilter === "wasted" && { color: "#fff" }]}>
                                Wasted
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => setActiveFilter("used")}
                            style={[ styles.filterButton, activeFilter === "used" && { backgroundColor: "#10b981" }]}>
                            <Text style={[styles.filterButtonText, activeFilter === "used" && { color: "#fff" }]}>
                                Used
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => setActiveFilter("donated")}
                            style={[ styles.filterButton, activeFilter === "donated" && { backgroundColor: "#3b82f6" }]}>
                            <Text style={[ styles.filterButtonText, activeFilter === "donated" && { color: "#fff" }]}>
                                Donated
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={[ styles.card, styles.fullCard, { borderColor: "#fbcfe8", borderWidth: 1 }]}>
                        <LinearGradient
                            colors={["#fdf2f8", "#ffffff"]}
                            style={styles.cardGradientWrapper}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <View style={[ styles.iconCircle, { backgroundColor: "#fce7f3" }]}>
                                <Ionicons name="heart" size={24} color={"#ec4899"}/>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.statNumber}>
                                    {totalDonated} Items Donated ({donatedPercent.toFixed(1)}%)
                                </Text>
                                <Text style={styles.statLabel}>
                                    Provided approx. {estimatedMeals} meals to local families in need
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={styles.statsGrid}>
                        <View style={[styles.card, { flex: 1 }]}>
                            <Ionicons name="pie-chart" size={20} color={"#65a30d"}/>
                            <Text style={styles.gridNumber}>
                                {efficiencyPercentage}%
                            </Text>
                            <Text style={styles.gridLabel}>
                                Pantry Efficiency ({totalDonated + totalUsed} items saved/donated)
                            </Text>
                        </View>
                        <View style={[styles.card, { flex: 1 }]}>
                            <Ionicons name="trash-outline" size={20} color={"#ef4444"}/>
                            <Text style={styles.gridNumber}>
                                {totalWastePercentage}%
                            </Text>
                            <Text style={styles.gridLabel}>
                                Total Food Waste ({totalWasted} Items)
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}
