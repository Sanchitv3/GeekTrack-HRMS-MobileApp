import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Button,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { AuthSessionResult } from "expo-auth-session";

type promptAsyncType = {
  promptAsync: () => Promise<AuthSessionResult>;
};
function LoginScreen({ promptAsync }: promptAsyncType) {
  return (
    <LinearGradient
      colors={["rgba(132, 155, 218, 0.5)", "rgba(77, 98, 179, 0.7)"]}
      style={styles.Background}
    >
      <View style={styles.LoginContainer}>
        <Image
          source={require("../../../assets/Login_Illustration.png")}
          alt="Login_Illustration_Image"
          contentFit="contain"
          style={styles.Illustration}
        />
        <View style={styles.Content}>
          <Image
            source={require("../../../assets/Geekyants_Logo.svg")}
            style={styles.GeekyLogo}
            alt="GeekyAnts Logo"
            contentFit="contain"
          />
          <Text style={styles.LoginMsg}>Log In to Your Account</Text>
          <TouchableOpacity
            onPress={() => promptAsync()}
            style={styles.LoginBtn}
          >
            <Text style={styles.BtnText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    justifyContent: "center",
  },
  LoginContainer: {
    marginHorizontal: 35,
    justifyContent: "center",
    gap: 50,
    flex: 0.5,
  },
  Illustration: {
    height: 200,
  },
  Content: {
    flex: 1,
    gap: 20,
    justifyContent: "flex-start",
  },
  GeekyLogo: {
    height: 50,
    width: 200,
  },
  LoginMsg: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1,
  },
  LoginBtn: {
    padding: 15,
    width: "100%",
    height: 50,
    backgroundColor: "rgba(252, 90, 90, 1)",
    borderRadius: 14,
  },
  BtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});

export default LoginScreen;
