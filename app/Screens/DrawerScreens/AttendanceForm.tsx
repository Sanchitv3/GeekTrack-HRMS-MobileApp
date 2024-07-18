import React, { useState, useEffect } from "react";
import { View, Text, Alert, Pressable, StyleSheet } from "react-native";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebaseConfig";
import DatePicker from "react-native-date-picker";
import { Picker } from "@react-native-picker/picker";

interface Attendance {
  id: string;
  date: Date;
  status: string;
}

const AttendanceForm: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [status, setStatus] = useState<string>("WFH");
  const [employeeID, setEmployeeID] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const fetchEmployeeID = async () => {
        const employeesQuery = query(
          collection(db, "Employees"),
          where("email", "==", currentUser.email)
        );
        const querySnapshot = await getDocs(employeesQuery);
        if (!querySnapshot.empty) {
          const employeeDoc = querySnapshot.docs[0];
          setEmployeeID(employeeDoc.id);
        }
      };

      fetchEmployeeID();
    }
  }, []);

  const handleSubmit = async () => {
    const validDate = new Date().toLocaleDateString();
    if (!date || !status || !employeeID || date.toLocaleDateString() !== validDate) {
      Alert.alert("Error", "Please fill all the fields correctly.");
      return;
    }

    try {
      // Check if an attendance record already exists for the current date
      const attendanceQuery = query(
        collection(db, "Attendance"),
        where("employeeID", "==", employeeID),
        where("date", "==", date.toISOString().split('T')[0])
      );
      const querySnapshot = await getDocs(attendanceQuery);

      if (!querySnapshot.empty) {
        Alert.alert("Error", "You have already marked attendance for today.");
        return;
      }

      // Add new attendance record
      await addDoc(collection(db, "Attendance"), {
        date: date.toISOString().split('T')[0],
        status,
        employeeID: employeeID,
      });
      Alert.alert("Success", "Attendance record submitted successfully.");
    } catch (error) {
      console.error("Error submitting attendance record: ", error);
      Alert.alert("Error", "Error submitting attendance record.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formInputs}>
        <Text style={styles.label}>Date</Text>
        <DatePicker date={date} onDateChange={setDate} mode="date" style={styles.datePicker} minimumDate={new Date()} maximumDate={new Date()} />
      </View>
      <View style={styles.formInputs}>
        <Text style={styles.label}>Status</Text>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
          itemStyle={styles.pickerItems}
        >
          <Picker.Item label="Home" value="WFH" />
          <Picker.Item label="Working from Office" value="WFO" />
        </Picker>
      </View>
      <Pressable onPress={handleSubmit} style={styles.btn}>
        <Text style={styles.btnTxt}>Submit Attendance</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 16,
    marginTop: 120,
    gap: 20
  },
  formInputs: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: "gray",
  },
  datePicker: {
    height: 80,
    overflow: "hidden"
  },
  pickerItems: {
    overflow: "hidden",
    height: 120
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

export default AttendanceForm;
