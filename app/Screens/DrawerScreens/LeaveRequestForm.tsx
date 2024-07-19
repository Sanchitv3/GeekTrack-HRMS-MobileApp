import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable } from "react-native";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebaseConfig";
import DatePicker from "react-native-date-picker";
import { Picker } from "@react-native-picker/picker";

const LeaveRequestForm: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [reason, setReason] = useState<string>("");
  const [employeeID, setEmployeeID] = useState<string>("");
  const [leaveType, setLeaveType] = useState<string>("Paid");

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const fetchEmployeeID = async () => {
        try {
          const employeesQuery = query(
            collection(db, "Employees"),
            where("email", "==", currentUser.email)
          );
          const querySnapshot = await getDocs(employeesQuery);
          if (!querySnapshot.empty) {
            const employeeDoc = querySnapshot.docs[0];
            setEmployeeID(employeeDoc.id);
          }
        } catch (error) {
          console.error("Error fetching employee ID: ", error);
        }
      };

      fetchEmployeeID();
    }
  }, []);

  const handleSubmit = async () => {
    if (!startDate || !endDate || startDate > endDate) {
      Alert.alert("Error", "Please fill all the fields correctly.");
      return;
    }

    try {
      await addDoc(collection(db, "LeaveRequests"), {
        employeeID,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        reason: leaveType === "Sick" ? "Sick" : reason, // Set reason based on leave type
        leaveType,
        status: "Pending",
      });
      // Reset form
      setStartDate(new Date());
      setEndDate(new Date());
      setReason("");
      setLeaveType("Paid"); // Reset leave type to Paid
      Alert.alert("Success", "Leave request submitted successfully.");
    } catch (error) {
      console.error("Error submitting leave request: ", error);
      Alert.alert("Error", "Error submitting leave request.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formInputs}>
        <Text style={styles.label}>Start Date</Text>
        <DatePicker
          date={startDate}
          onDateChange={setStartDate}
          mode="date"
          style={styles.datePicker}
        />
      </View>
      <View style={styles.formInputs}>
        <Text style={styles.label}>End Date</Text>
        <DatePicker
          date={endDate}
          onDateChange={setEndDate}
          mode="date"
          style={styles.datePicker}
        />
      </View>
      <View style={styles.formInputs}>
        <Text style={styles.label}>Leave Type</Text>
        <Picker
          selectedValue={leaveType}
          onValueChange={(itemValue) => setLeaveType(itemValue)}
          itemStyle={{height:80}}
        >
          <Picker.Item label="Sick" value="Sick" />
          <Picker.Item label="Paid" value="Paid" />
          <Picker.Item label="Unpaid" value="Unpaid" />
        </Picker>
      </View>
      {leaveType !== "Sick" && (
        <View style={styles.formInputs}>
          <Text style={styles.label}>Reason</Text>
          <TextInput
            style={styles.input}
            placeholder="Reason"
            value={reason}
            onChangeText={setReason}
          />
        </View>
      )}
      <Pressable onPress={handleSubmit} style={styles.btn}>
        <Text style={styles.btnTxt}>Submit Leave Request</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    paddingHorizontal: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
  },
  label: {
    marginBottom: 8,
    color: "gray",
  },
  formInputs: {
    marginBottom: 16,
  },
  datePicker: {
    height: 80,
    overflow: "hidden",
  },
  btn: {
    marginTop: 24,
    backgroundColor: "#3B82F6",
    padding: 20,
    borderRadius: 24,
  },
  btnTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center"
  }
});

export default LeaveRequestForm;
