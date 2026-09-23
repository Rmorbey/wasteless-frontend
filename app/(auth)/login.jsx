import { useRouter } from "expo-router";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity
} from "react-native";
import { authStyles as styles } from "../../constants/AuthStyles";
import { useAuth } from "../_layout";

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please fill out all fields");
            return;
        }

        await login(email, password);
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
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                    Log in to manage your surplus food pantry
                </Text>

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="example@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
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

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                    <Text style={styles.linkText}>
                        Don't have an account? Sign up
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
