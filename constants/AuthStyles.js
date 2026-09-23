import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#4CAF50",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 32,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: "#FAFAFA",
        marginBottom: 20,
        color: "#000",
    },
    button: {
        backgroundColor: "#4CAF50",
        height: 52,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    linkText: {
        marginTop: 24,
        textAlign: "center",
        color: "#007BFF",
        fontSize: 14,
        textDecorationLine: "underline",
    },
});
