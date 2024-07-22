import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { Calendar, DateObject } from 'react-native-calendars';

interface Attendance {
  id: string;
  date: string; // Use string type for easier handling with the calendar
  status: string;
}

const AttendanceRecord = () => {
  const [employeeID, setEmployeeID] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

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

  useEffect(() => {
    if (employeeID) {
      const attendanceQuery = query(
        collection(db, "Attendance"),
        where("employeeID", "==", employeeID)
      );

      const unsubscribe = onSnapshot(attendanceQuery, (snapshot) => {
        const attendanceData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Attendance),
          date: (doc.data() as Attendance).date.split('T')[0], // Ensure the date is in YYYY-MM-DD format
        }));
        attendanceData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAttendanceRecords(attendanceData);
        markAttendanceDates(attendanceData);
      });

      return () => unsubscribe();
    }
  }, [employeeID]);

  const markAttendanceDates = (records: Attendance[]) => {
    const dates = records.reduce((acc, record) => {
      acc[record.date] = {
        marked: true,
        dotColor: record.status === "WFO" || record.status === "WFH" ? "green" : "purple"
      };
      return acc;
    }, {} as { [key: string]: any });

    // Add off days for Saturdays and Sundays
    const today = new Date();
    const year = today.getFullYear();
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        if (date.getDay() === 0 || date.getDay() === 6) { // Sunday or Saturday
          const dateString = date.toISOString().split('T')[0];
          if (!dates[dateString]) {
            dates[dateString] = {
              marked: true,
              dotColor: 'red',
            };
          }
        }
      }
    }

    setMarkedDates(dates);
  };

  const handleDayPress = (day: DateObject) => {
    const dateString = day.dateString;
    const record = attendanceRecords.find(record => record.date === dateString);

    if (record) {
      Alert.alert("Attendance Details", `Date: ${record.date}\nStatus: ${record.status}`);
    } else if (new Date(dateString).getDay() === 0 || new Date(dateString).getDay() === 6) {
      Alert.alert("Off Day", "This is a scheduled off day.");
    } else {
      Alert.alert("No Record", "No attendance record for this date.");
    }
  };

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Attendance Record</Text>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        style={styles.calendar}
      />
    </View>
  );
};

export default AttendanceRecord;

const styles = StyleSheet.create({
  main: {
    marginTop: 110,
    padding: 16,
  },
  calendar: {
    marginBottom: 16,
  },
  attendanceRecords: {
    marginTop: 16,
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
});
