import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { collection, getDocs, onSnapshot, query, where, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebaseConfig";
import userStore from "../../stores/userStore";

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: "Sick" | "Paid" | "Unpaid";
  status: string;
}

const LeaveBalance: React.FC = () => {
  const [leaveBalances, setLeaveBalances] = useState({
    Sick: 12,
    Paid: 12,
    Unpaid: 12,
  });
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([]);
  const [employeeID, setEmployeeID] = useState<string>("");

  useEffect(() => {
    const fetchLeaveData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const queryResult = query(
            collection(db, "Employees"),
            where("email", "==", userStore.userEmail)
          );
          const employeeData = await getDocs(queryResult);
          if (!employeeData.empty) {
            const empDoc = employeeData.docs[0];
            setEmployeeID(empDoc.id);
            const leaveRequestsQuery = query(
              collection(db, "LeaveRequests"),
              where("employeeID", "==", empDoc.id)
            );

            const unsubscribe = onSnapshot(leaveRequestsQuery, (snapshot) => {
              const leaveHistoryData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<LeaveRequest, "id">),
              }));
              setLeaveHistory(leaveHistoryData);

              const leaveCounts = { Sick: 12, Paid: 12, Unpaid: 12 };

              leaveHistoryData.forEach((leave) => {
                if (leave.status === "Approved") {
                  const startDate = new Date(leave.startDate);
                  const endDate = new Date(leave.endDate);
                  const days = (endDate.getDate() - startDate.getDate()) + 1; // Add 1 to include the end date
                  leaveCounts[leave.leaveType] -= days;
                }
              });

              setLeaveBalances(leaveCounts);
              updateLeaveBalancesInFirestore(empDoc.id, leaveCounts);
              console.log(leaveCounts)
            });

            return () => unsubscribe();
          }
        } catch (error) {
          console.error("Error fetching leave data: ", error);
        }
      }
    };

    fetchLeaveData();
  }, []);

  const updateLeaveBalancesInFirestore = async (employeeID: string, leaveCounts: { [key: string]: number }) => {
    try {
      const leaveBalancesRef = doc(db, "LeaveBalances", employeeID);
      await setDoc(leaveBalancesRef, leaveCounts, { merge: true });
    } catch (error) {
      console.error("Error updating leave balances in Firestore: ", error);
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

  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <Text style={styles.counterText}>Sick Leaves Remaining: {leaveBalances.Sick}</Text>
        <Text style={styles.counterText}>Paid Leaves Remaining: {leaveBalances.Paid}</Text>
        <Text style={styles.counterText}>Unpaid Leaves Remaining: {leaveBalances.Unpaid}</Text>
      </View>
      <Text style={styles.title}>Leave History:</Text>
      <ScrollView>
        {leaveHistory.length === 0 ? (
          <Text>No Leave History Found</Text>
        ) : (
          leaveHistory.map((leave) => (
            <View key={leave.id} style={styles.leaveItem}>
              <Text>Start Date: {new Date(leave.startDate).toLocaleDateString()}</Text>
              <Text>End Date: {new Date(leave.endDate).toLocaleDateString()}</Text>
              <Text>Reason: {leave.reason}</Text>
              <Text>Type: {leave.leaveType}</Text>
              <Text style={getStatusStyle(leave.status)}>Status: {leave.status}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 120,
    gap: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  leaveItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 8,
  },
  counter: {
    backgroundColor: "#475466",
    borderRadius: 20,
  },
  counterText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    padding: 20,
    textAlign: "center",
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
});

export default LeaveBalance;
