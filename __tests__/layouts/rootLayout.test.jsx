import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import RootLayout from "../../app/_layout";

jest.mock("expo-router", () => {
  const React = require("react");
  const { Pressable, Text, View } = require("react-native");
  const Stack = ({ children }) => {
    const { useAuth } = require("../../app/_layout");

    const { token, userId, login, register, logout } = useAuth();
    return React.createElement(
      View,
      { testID: "stack" },
      React.createElement(Text, { testID: "token" }, token || "no-token"),
      React.createElement(
        Text,
        { testID: "user-id" },
        userId ? String(userId.user_id) : "no-user",
      ),
      React.createElement(
        Pressable,
        {
          testID: "login-button",
          onPress: () => login("testuser", "password123"),
        },
        React.createElement(Text, null, "Login"),
      ),
      React.createElement(
        Pressable,
        {
          testID: "register-button",
          onPress: () => register("testuser", "password123").catch(() => {}),
        },
        React.createElement(Text, null, "Register"),
      ),
      React.createElement(
        Pressable,
        {
          testID: "logout-button",
          onPress: logout,
        },
        React.createElement(Text, null, "Logout"),
      ),
      children,
    );
  };
  Stack.Screen = () => null;
  Stack.Protected = ({ children }) =>
    React.createElement(React.Fragment, null, children);
  return {
    Stack,
  };
});

describe("RootLayout", () => {
    beforeEach(async () => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
        global.alert = jest.fn()
        await render(<RootLayout />)
    })
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it("renders with the user logged out", () => {
        expect(screen.getByTestId("token").props.children).toBe("no-token")
        expect(screen.getByTestId("user-id").props.children).toBe("no-user")
    })

    it("logs in successfully", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                token: "mock-token",
                user_id: 123,
            }),
        })
        await fireEvent.press(screen.getByTestId("login-button"))
        await waitFor(() => {
            expect(screen.getByTestId("token").props.children).toBe("mock-token")
        })
        expect(screen.getByTestId("user-id").props.children).toBe("123")
        expect(global.fetch).toHaveBeenCalledWith(
            "http://4.225.221.72/users/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: "testuser",
                    password: "password123",
                }),
            }
        )
    })

    it("shows and alert when login fails", async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                message: "Invalid login",
            }),
        })
        await fireEvent.press(screen.getByTestId("login-button"))
        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("Invalid login")
        })
        expect(screen.getByTestId("token").props.children).toBe("no-token")
    })

    it("registers successfully", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                message: "User created",
            }),
        })
        await fireEvent.press(screen.getByTestId("register-button"))
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://4.225.221.72/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: "testuser",
                        password: "password123",
                    }),
                }
            )
        })
        expect(global.alert).toHaveBeenCalledWith("Account created successfully! Please log in.")
    })

    it("shows and alert when registration fails", async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                message: "Registration failed",
            }),
        })
        await fireEvent.press(screen.getByTestId("register-button"))
        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("Registration failed")
        })
    })
})