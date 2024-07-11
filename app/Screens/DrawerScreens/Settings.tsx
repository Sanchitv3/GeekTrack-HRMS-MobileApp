import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import auth from "../../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userStore from "../../stores/userStore";
import { Image } from "expo-image";
import { router } from "expo-router";

export default function Settings() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.clear();
      userStore.setUserInfo(null);
      console.log("signed out");
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View style={styles.Main}>
      <View style={styles.Profile}>
        <Image
          source={{ uri: userStore.userPhoto }}
          style={styles.ProfilePic}
        />
        <View style={styles.ProfileInfo}>
          <Text style={styles.ProfileText}>
            <Text style={styles.ProfileLabels}>Name: </Text>
            {userStore.userName}
          </Text>
          <Text style={styles.ProfileText}>
            <Text style={styles.ProfileLabels}>Email: </Text>
            {userStore.userEmail}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={handleSignOut}
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? "rgba(82, 100, 204, 0.5)"
              : "rgba(82, 100, 204, 1)",
            padding: 20,
            width: 200,
            alignItems: "center",
            borderRadius: 24,
          },
        ]}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          Sign Out
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  Main: {
    flex: 1,
    marginTop: 100,
    alignItems: "center",
  },
  Profile: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  ProfilePic: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  ProfileText: {
    fontSize: 20,
  },
  ProfileLabels: {
    fontWeight: "bold",
  },
  ProfileInfo: {
    backgroundColor: "rgba(0, 0, 0, 0.18)",
    borderRadius: 24,
    padding: 20,
  },
});
