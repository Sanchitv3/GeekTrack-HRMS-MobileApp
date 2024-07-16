import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { collection, query, where, onSnapshot, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebaseConfig";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

interface Timesheet {
  id: string;
  date: string;
  hoursWorked: number;
  description: string;
  status: string;
  projectID: string;
}

const TimesheetList: React.FC = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [employeeID, setEmployeeID] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeID = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const employeesQuery = query(
          collection(db, "Employees"),
          where("email", "==", currentUser.email)
        );
        const querySnapshot = await getDocs(employeesQuery);
        if (!querySnapshot.empty) {
          const employeeDoc = querySnapshot.docs[0];
          setEmployeeID(employeeDoc.id);
        }
      }
    };

    fetchEmployeeID();
  }, []);

  useEffect(() => {
    if (employeeID) {
      const fetchTimesheets = () => {
        const timesheetQuery = query(
          collection(db, "Timesheets"),
          where("employeeID", "==", employeeID)
        );

        const unsubscribe = onSnapshot(timesheetQuery, (snapshot) => {
          const timesheetData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Timesheet, "id">),
          }));
          setTimesheets(timesheetData);
        });

        return () => unsubscribe();
      };

      fetchTimesheets();
    }
  }, [employeeID]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Timesheets", id));
      Alert.alert("Success", "Timesheet deleted successfully.");
    } catch (error) {
      console.error("Error deleting timesheet: ", error);
      Alert.alert("Error", "Error deleting timesheet.");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return styles.approvedStatus;
      case "Rejected":
        return styles.rejectedStatus;
      case "Pending":
        return styles.pendingStatus;
      default:
        return styles.status;
    }
  };

  const renderRightActions = (id: string) => (
    <View style={styles.deleteButtonContainer}>
      <Text style={styles.deleteButton} onPress={() => handleDelete(id)}>
        Delete
      </Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>My Timesheets</Text>
      {timesheets.length === 0 ? (
        <Text>No timesheets found.</Text>
      ) : (
        timesheets.map((item) => (
          <Swipeable
            key={item.id}
            renderRightActions={() => renderRightActions(item.id)}
          >
            <View style={styles.timesheetItem}>
              <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
              <Text>Hours Worked: {item.hoursWorked}</Text>
              <Text>Description: {item.description}</Text>
              <Text style={getStatusStyle(item.status)}>Status: {item.status}</Text>
            </View>
          </Swipeable>
        ))
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    marginTop: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timesheetItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  approvedStatus: {
    color: "green",
    fontWeight: "bold",
  },
  rejectedStatus: {
    color: "red",
    fontWeight: "bold",
  },
  pendingStatus: {
    color: "orange",
    fontWeight: "bold",
  },
  status: {
    fontWeight: "bold",
  },
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    backgroundColor: "red",
  },
  deleteButton: {
    color: "white",
    fontWeight: "bold",
    padding: 10,
  },
});

export default TimesheetList;
