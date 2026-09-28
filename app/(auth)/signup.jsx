import { useRouter } from "expo-router";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
} from "react-native";
import { authStyles as styles } from "../../constants/AuthStyles";
import { useAuth } from "../_layout";

export default function SignUpScreen() {
    const router = useRouter();
    const { register } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async () => {
        if (!username|| !password) {
            alert("Please fill out all fields");
            return;
        }

        try {
            await register(username, password);

            router.replace("/(auth)/login");
        } catch (error) {
            console.error("Registration error:", error)
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Join Wasteless</Text>
                <Text style={styles.subtitle}>
                    Help reduce waste in your local community
                </Text>

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="example@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#999"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    secureTextEntry={true}
                    autoCapitalize="none"
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#999"
                />

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                    <Text style={styles.linkText}>
                        Already have an account? Log In
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
