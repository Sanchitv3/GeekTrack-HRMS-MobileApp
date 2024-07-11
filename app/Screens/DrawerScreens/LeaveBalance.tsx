import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebaseConfig";

const LeaveBalance: React.FC = () => {
  const [leaveBalance, setLeaveBalance] = useState<number>(0);
  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const leaveRequestsQuery = query(
        collection(db, "LeaveRequests"),
        where("employeeID", "==", currentUser.uid)
      );

      const unsubscribe = onSnapshot(leaveRequestsQuery, (snapshot) => {
        const leaveHistoryData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaveHistory(leaveHistoryData);

        const approvedLeaves = leaveHistoryData.filter(leave => leave.status === "Approved").length;
        setLeaveBalance(20 - approvedLeaves); // Assuming 20 leaves per year
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <View style={styles.container}>
        <View style={styles.Counter}>
            <Text style={styles.CounterText}>Leave Balance: {leaveBalance}</Text>
        </View>
      
      <Text style={styles.title}>Leave History: </Text>
      {leaveHistory.map.length<=1 ? <Text>No Leave History Found</Text> : leaveHistory.map(leave => (
        <View key={leave.id} style={styles.leaveItem}>
          <Text>Start Date: {new Date(leave.startDate).toLocaleDateString()}</Text>
          <Text>End Date: {new Date(leave.endDate).toLocaleDateString()}</Text>
          <Text>Reason: {leave.reason}</Text>
          <Text>Status: {leave.status}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop:120,
    gap:20
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
  Counter:{
    backgroundColor:"#475466",
    borderRadius:20
  },
  CounterText:{
    color:"white",
    fontWeight:"bold",
    fontSize:20,
    padding:20,
    textAlign:"center",
  }
});

export default LeaveBalance;
