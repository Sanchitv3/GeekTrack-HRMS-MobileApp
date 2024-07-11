import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Pressable } from "react-native";
import { collection, addDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
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
  const [status, setStatus] = useState<string>("Present");
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
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

      if (employeeID) {
        const attendanceQuery = query(
          collection(db, "Attendance"),
          where("employeeID", "==", employeeID)
        );

        const unsubscribe = onSnapshot(attendanceQuery, (snapshot) => {
          const attendanceData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Attendance[];
          setAttendanceRecords(attendanceData);
        });

        return () => unsubscribe();
      }
    }
  }, [employeeID]);

  const handleSubmit = async () => {
    const validDate= new Date().toLocaleDateString();
    if (!date || !status || !employeeID || date.toLocaleDateString()!==validDate) {
      Alert.alert("Error", "Please fill all the fields correctly.");
      return;
    }

    try {
      await addDoc(collection(db, "Attendance"), {
        date: date.toISOString(),
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
        <DatePicker date={date} onDateChange={setDate} mode="date" style={styles.datePicker}/>
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
      
      <ScrollView style={styles.attendanceRecords}>
        <Text style={styles.title}>Attendance Records</Text>
        {attendanceRecords.map(record => (
          <View key={record.id} style={styles.attendanceItem}>
            <Text>Date: {new Date(record.date).toLocaleDateString()}</Text>
            <Text>Status: {record.status}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    marginTop:120
  },
  formInputs: {
    marginBottom: 16,
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
  attendanceRecords: {
    marginTop: 32,
  },
  attendanceItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  datePicker:{
    height:80,
    overflow:"hidden"
  },
  pickerItems:{
    overflow:"hidden",
    height:120
  },
  btn:{
    backgroundColor:"blue",
    padding:16,
    borderRadius:14
  },
  btnTxt:{
    color:"white",
    fontWeight:"bold",
    fontSize:16
  }
});

export default AttendanceForm;
