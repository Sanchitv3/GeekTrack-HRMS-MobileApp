import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "react-native-date-picker";

interface Project {
  id: string;
  name: string;
}

const TimesheetEntry: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employeeID, setEmployeeID] = useState<string>("");
  const [projectID, setProjectID] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [hoursWorked, setHoursWorked] = useState<number>(0);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setEmployeeID(currentUser.uid);
    }

    const fetchProjects = async () => {
      try {
        const projectsCollection = await getDocs(collection(db, "Projects"));
        const projectsData = projectsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async () => {
    if (!projectID || !date || hoursWorked <= 0) {
      Alert.alert("Error", "Please fill all the fields correctly.");
      return;
    }

    try {
      await addDoc(collection(db, "Timesheets"), {
        employeeID,
        projectID,
        date: date.toISOString(),
        hoursWorked,
        status: "Pending",
      });
      // Reset form
      setProjectID("");
      setDate(new Date());
      setHoursWorked(0);
      Alert.alert("Success", "Timesheet submitted successfully.");
    } catch (error) {
      console.error("Error submitting timesheet: ", error);
      Alert.alert("Error", "Error submitting timesheet.");
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.FormInputs}>
        <Text style={styles.Label}>Project</Text>
      <Picker
        selectedValue={projectID}
        onValueChange={(itemValue) => setProjectID(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a Project" value="" />
        {projects.map((project) => (
          <Picker.Item key={project.id} label={project.name} value={project.id} />
        ))}
      </Picker>
      </View>
      <View style={styles.FormInputs}>
      <Text style={styles.Label}>Date</Text>
      <DatePicker
        date={date}
        onDateChange={setDate}
        mode="date"
        minimumDate={new Date()}
        style={styles.datePicker}
      />
      </View>

      <View style={styles.FormInputs}>
      <Text style={styles.Label}>Hours Worked</Text>

      <TextInput
        style={styles.input}
        placeholder="Hours Worked"
        value={hoursWorked.toString()}
        onChangeText={(text) => setHoursWorked(Number(text))}
        keyboardType="numeric"
      />
      </View>
      <Button title="Submit Timesheet" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    gap:40,
    marginLeft:30
  },
  input: {
    height: 40,
    backgroundColor:"rgba(246, 246, 246, 1)",
    paddingHorizontal: 8,
    width:"85%",
    borderRadius:8
  },
  picker: {
    overflow:"hidden",
    height:140,
    width: "85%",

  },
  datePicker: {
    overflow:"hidden",
    height:80
  },
  Label: {
    color: "gray",
  },
  FormInputs: {
    gap: 5,
  },
  
});

export default TimesheetEntry;
