import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { TWPallet } from "../../constants/TWPallet";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardScreen() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const [activeFilter, setActiveFilter] = useState("all");

    const bgColors = [TWPallet.slate[100], "#ffffff", TWPallet.slate[100]];

    const wastedData = [
        { value: 12, label: "Wk 1" },
        { value: 8, label: "Wk 2" },
        { value: 4, label: "Wk 3" },
        { value: 2, label: "Wk 4" },
    ];
    const usedData = [
        { value: 25, label: "Wk 1" },
        { value: 30, label: "Wk 2" },
        { value: 28, label: "Wk 3" },
        { value: 35, label: "Wk 4" },
    ];
    const donatedData = [
        { value: 5, label: "Wk 1" },
        { value: 14, label: "Wk 2" },
        { value: 22, label: "Wk 3" },
        { value: 18, label: "Wk 4" },
    ];

    const getMonthName = (month) => {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        return months[month];
    };

    const navigateMonth = (direction) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const getActiveDataSet = () => {
        const showWasted = activeFilter === "all" || activeFilter === "wasted";
        const showUsed = activeFilter === "all" || activeFilter === "used";
        const showDonated =
            activeFilter === "all" || activeFilter === "donated";

        return [
            {
                data: wastedData,
                color: showWasted ? TWPallet.red[500] : "transparent",
                dataPointsColor: showWasted ? TWPallet.red[500] : "transparent",
            },
            {
                data: usedData,
                color: showUsed ? TWPallet.lime[500] : "transparent",
                dataPointsColor: showUsed ? TWPallet.lime[500] : "transparent",
            },
            {
                data: donatedData,
                color: showDonated ? TWPallet.blue[500] : "transparent",
                dataPointsColor: showDonated
                    ? TWPallet.blue[500]
                    : "transparent",
            },
        ];
    };

    return (
        <LinearGradient style={{ flex: 1 }} colors={bgColors}>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{ paddingBottom: 32 }}
            >
                <View style={styles.headerRow}>
                    <Pressable
                        onPress={() => navigateMonth(-1)}
                        style={styles.navButton}
                        hitSlop={20}
                    >
                        <Ionicons
                            name={"chevron-back"}
                            size={18}
                            color={TWPallet.slate[600]}
                        />
                    </Pressable>

                    <Text style={styles.headerTitle}>
                        {getMonthName(currentMonth)} {currentYear}
                    </Text>

                    <Pressable
                        onPress={() => navigateMonth(1)}
                        style={styles.navButton}
                        hitSlop={20}
                    >
                        <Ionicons
                            name={"chevron-forward"}
                            size={18}
                            color={TWPallet.slate[600]}
                        />
                    </Pressable>
                </View>

                <View
                    style={[
                        styles.card,
                        { marginHorizontal: 16, marginBottom: 16 },
                    ]}
                >
                    <Text style={styles.cardTitle}>Food Inventory Trends</Text>

                    <View
                        style={{
                            flexDirection: "row",
                            gap: 16,
                            marginBottom: 16,
                        }}
                    >
                        {(activeFilter === "all" ||
                            activeFilter === "wasted") && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <View
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: TWPallet.red[500],
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: TWPallet.slate[600],
                                        fontWeight: "600",
                                    }}
                                >
                                    Wasted
                                </Text>
                            </View>
                        )}
                        {(activeFilter === "all" ||
                            activeFilter === "used") && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <View
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: TWPallet.lime[500],
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: TWPallet.slate[600],
                                        fontWeight: "600",
                                    }}
                                >
                                    Used
                                </Text>
                            </View>
                        )}
                        {(activeFilter === "all" ||
                            activeFilter === "donated") && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <View
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: TWPallet.blue[500],
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: TWPallet.slate[600],
                                        fontWeight: "600",
                                    }}
                                >
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
                        xAxisColor={TWPallet.slate[200]}
                        xAxisLabelTextStyle={{
                            color: TWPallet.slate[400],
                            fontSize: 11,
                        }}
                        yAxisTextStyle={{
                            color: TWPallet.slate[400],
                            fontSize: 11,
                        }}
                        height={160}
                        animateOnDataChange={false}
                    />

                    <View style={styles.filterButtonGroup}>
                        <Pressable
                            onPress={() => setActiveFilter("all")}
                            style={[
                                styles.filterButton,
                                activeFilter === "all" && {
                                    backgroundColor: TWPallet.yellow[500],
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    activeFilter === "all" && { color: "#fff" },
                                ]}
                            >
                                All
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setActiveFilter("wasted")}
                            style={[
                                styles.filterButton,
                                activeFilter === "wasted" && {
                                    backgroundColor: TWPallet.red[500],
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    activeFilter === "wasted" && {
                                        color: "#fff",
                                    },
                                ]}
                            >
                                Wasted
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setActiveFilter("used")}
                            style={[
                                styles.filterButton,
                                activeFilter === "used" && {
                                    backgroundColor: TWPallet.lime[500],
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    activeFilter === "used" && {
                                        color: "#fff",
                                    },
                                ]}
                            >
                                Used
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setActiveFilter("donated")}
                            style={[
                                styles.filterButton,
                                activeFilter === "donated" && {
                                    backgroundColor: TWPallet.blue[500],
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    activeFilter === "donated" && {
                                        color: "#fff",
                                    },
                                ]}
                            >
                                Donated
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View
                        style={[
                            styles.card,
                            styles.fullCard,
                            { borderColor: TWPallet.pink[200], borderWidth: 1 },
                        ]}
                    >
                        <LinearGradient
                            colors={[TWPallet.pink[50], "#ffffff"]}
                            style={styles.cardGradientWrapper}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <View
                                style={[
                                    styles.iconCircle,
                                    { backgroundColor: TWPallet.pink[100] },
                                ]}
                            >
                                <Ionicons
                                    name="heart"
                                    size={24}
                                    color={TWPallet.pink[500]}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.statNumber}>
                                    Hardcoded: 24 meals
                                </Text>
                                <Text style={styles.statLabel}>
                                    Hardcoded: Shared with nearby families in
                                    need
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={styles.statsGrid}>
                        <View style={[styles.card, { flex: 1 }]}>
                            <Ionicons
                                name="pie-chart"
                                size={20}
                                color={TWPallet.lime[600]}
                            />
                            <Text style={styles.gridNumber}>
                                Hardcoded: 82%
                            </Text>
                            <Text style={styles.gridLabel}>
                                Hardcoded: Pantry Efficiency
                            </Text>
                        </View>
                        <View style={[styles.card, { flex: 1 }]}>
                            <Ionicons
                                name="trash-outline"
                                size={20}
                                color={TWPallet.red[500]}
                            />
                            <Text style={styles.gridNumber}>
                                Hardcoded: 1.4kg
                            </Text>
                            <Text style={styles.gridLabel}>
                                Hardcoded: Total Food Waste
                            </Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>
                            Hardcoded: Waste Insights
                        </Text>
                        <Text style={styles.bodyText}>
                            Hardcoded: Your primary wasted category this month
                            was{" "}
                            <Text
                                style={{
                                    fontWeight: "700",
                                    color: TWPallet.red[600],
                                }}
                            >
                                Fresh Produce
                            </Text>
                            , accounting for 70% of discarded items.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 16,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: TWPallet.slate[900],
    },
    navButton: {
        padding: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 1,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: TWPallet.slate[800],
        marginBottom: 16,
    },
    filterButtonGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        gap: 6,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 8,
        backgroundColor: TWPallet.slate[100],
        borderRadius: 8,
        alignItems: "center",
    },
    filterButtonText: {
        fontSize: 11,
        fontWeight: "600",
        color: TWPallet.slate[600],
    },
    statsContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    fullCard: {
        padding: 0,
        overflow: "hidden",
    },
    cardGradientWrapper: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        gap: 14,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    statNumber: {
        fontSize: 22,
        fontWeight: "800",
        color: TWPallet.slate[900],
    },
    statLabel: {
        fontSize: 13,
        color: TWPallet.slate[500],
        fontWeight: "500",
    },
    statsGrid: {
        flexDirection: "row",
        gap: 12,
    },
    gridNumber: {
        fontSize: 20,
        fontWeight: "800",
        color: TWPallet.slate[900],
        marginTop: 8,
        marginBottom: 2,
    },
    gridLabel: {
        fontSize: 12,
        color: TWPallet.slate[500],
        fontWeight: "500",
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: TWPallet.slate[900],
        marginBottom: 6,
    },
    bodyText: {
        fontSize: 13,
        color: TWPallet.slate[600],
        lineHeight: 18,
    },
    subtitle: {
        fontSize: 13,
        color: TWPallet.slate[600],
    },
});
