import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebaseConfig";
import userStore from "../../stores/userStore";

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

const LeaveBalance: React.FC = () => {
  const [leaveBalance, setLeaveBalance] = useState<number>(0);
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([]);
  const [employeeID, setEmployeeID] = useState<string>("");
  const leavesCount=24; // Assuming 24 leaves per year
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

              const approvedLeaves = leaveHistoryData.filter(
                (leave) => leave.status === "Approved"
              ).length;
              setLeaveBalance(leavesCount - approvedLeaves); 
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

  return (
    <View style={styles.container}>
      <View style={styles.counter}>
      <Text style={styles.counterText}>Total Leaves: {leavesCount}</Text>
        <Text style={styles.counterText}>Leaves Remaining: {leaveBalance}</Text>
      </View>
      <Text style={styles.title}>Leave History: </Text>
      {leaveHistory.length === 0 ? (
        <Text>No Leave History Found</Text>
      ) : (
        leaveHistory.map((leave) => (
          <View key={leave.id} style={styles.leaveItem}>
            <Text>Start Date: {new Date(leave.startDate).toLocaleDateString()}</Text>
            <Text>End Date: {new Date(leave.endDate).toLocaleDateString()}</Text>
            <Text>Reason: {leave.reason}</Text>
            <Text>Status: {leave.status}</Text>
          </View>
        ))
      )}
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
});

export default LeaveBalance;
