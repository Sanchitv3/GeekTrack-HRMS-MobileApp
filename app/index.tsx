import LoginScreen from "./Screens/LoginScreen/LoginScreen";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import auth from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect, router } from "expo-router";
import { observer } from "mobx-react-lite";
import userStore from "./stores/userStore";

WebBrowser.maybeCompleteAuthSession();

const App = observer(() => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    androidClientId:
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((error) => {
        console.error("Error signing in with credential: ", error);
        alert("Authentication failed. Please try again.");
      });
    }
  }, [response]);

  useEffect(() => {
    userStore.checkLocalUser();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        userStore.setUserInfo(user);
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        router.push("/Screens/DrawerScreens/Dashboard");
      } else {
        console.log("User is not Authenticated!!");
        await AsyncStorage.removeItem("@user");
        userStore.setUserInfo(null);
      }
    });

    return () => {
      unsubscribe(); // Cleanup the subscription on component unmount
    };
  }, []);

  if (userStore.loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return userStore.userInfo ? (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <ActivityIndicator size={"large"} />
    </View>
  ) : (
    <LoginScreen promptAsync={promptAsync} />
  );
});

export default App;
