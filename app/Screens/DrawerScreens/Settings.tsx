import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import auth from "../../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userStore from "../../stores/userStore";
import { Image } from "expo-image";
import { router } from "expo-router";
import { getFirestore, collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { format } from 'date-fns';

const db = getFirestore();

export default function Settings() {
  const [employeeInfo, setEmployeeInfo] = useState<any>(null);
  const fetchEmployeeInfo = async () => {
    try {
      const userEmail = auth.currentUser?.email;
      if (userEmail) {
        const employeeQuery = query(
          collection(db, "Employees"),
          where("email", "==", userEmail)
        );
        const querySnapshot = await getDocs(employeeQuery);
        if (!querySnapshot.empty) {
          const employeeData = querySnapshot.docs[0].data();
          setEmployeeInfo(employeeData);
        }
      }
    } catch (error) {
      console.error("Error fetching employee info: ", error);
    }
  };

  useEffect(() => {
    fetchEmployeeInfo();
  }, []);

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
const formatedDate= employeeInfo?.dateOfJoining.toDate ? 
format(employeeInfo?.dateOfJoining.toDate(), 'dd-MM-yyyy'): employeeInfo?.dateOfJoining;
  return (
    <ScrollView style={styles.Main} >
      <View style={styles.Profile}>
        <Image
          source={{ uri: userStore.userPhoto }}
          style={styles.ProfilePic}
        />
        <View style={styles.ProfileInfo}>
          <Text style={styles.ProfileText}>
            <Text style={styles.ProfileLabels}>Name: </Text>
            {employeeInfo?.name}
          </Text>
          <Text style={styles.ProfileText}>
            <Text style={styles.ProfileLabels}>Email: </Text>
            {employeeInfo?.email}
          </Text>
          <Text style={styles.ProfileText}>
            <Text style={styles.ProfileLabels}>Phone: </Text>
            {employeeInfo?.phone}
          </Text>
          <Text style={styles.ProfileText}>
            <Text style={styles.ProfileLabels}>Address Line: </Text>
            {employeeInfo?.addressLine1}
          </Text>
          <Text style={styles.ProfileText}>
            <Text style={styles.ProfileLabels}>City: </Text>
            {employeeInfo?.city}
          </Text>
          <Text style={styles.ProfileText}>
            <Text style={styles.ProfileLabels}>State: </Text>
            {employeeInfo?.state}
          </Text>
          <Text style={styles.ProfileText}>
            <Text style={styles.ProfileLabels}>Country: </Text>
            {employeeInfo?.country}
          </Text>
          <Text style={styles.ProfileText}>
            <Text style={styles.ProfileLabels}>ZipCode: </Text>
            {employeeInfo?.zipcode}
          </Text>
          <Text style={styles.ProfileText}>
            <Text style={styles.ProfileLabels}>Date Of Joining: </Text>
            {formatedDate}
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
            marginHorizontal:"auto"
          },
        ]}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          Sign Out
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  Main: {
    flex: 1,
    marginTop: 100,
    paddingTop:20
  },
  Profile: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom:40
  },
  ProfilePic: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  ProfileText: {
    fontSize: 18,
  },
  ProfileLabels: {
    fontWeight: "bold",
  },
  ProfileInfo: {
    backgroundColor:"white",
    borderRadius: 24,
    padding: 20,
  },
});
