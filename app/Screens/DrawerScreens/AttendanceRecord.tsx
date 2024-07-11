import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

interface Attendance {
    id: string;
    date: Date;
    status: string;
  }

const AttendanceRecord = () => {
    const [employeeID, setEmployeeID] = useState<string | null>(null);
    const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);

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
  return (
    <View style={styles.main}>
        <Text style={styles.title}>Attendance Record</Text>
      <ScrollView style={styles.attendanceRecords}>
        {attendanceRecords.map(record => (
          <View key={record.id} style={styles.attendanceItem}>
            <Text>Date: {new Date(record.date).toLocaleDateString()}</Text>
            <Text>Status: {record.status}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default AttendanceRecord

const styles = StyleSheet.create({
    main:{
        marginTop:110,
    },
    attendanceRecords: {
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

})