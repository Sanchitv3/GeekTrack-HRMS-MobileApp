import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { AttendanceRecords, LeaveRequest, LeavesRecord, LogTimesheet, MarkAttendance, Payroll, TimesheetRecords } from '../../../assets';
import { router } from 'expo-router';

const Dashboard = () => {
  return (
    <View style={styles.Main}>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/AttendanceForm')}>
        <Image source={MarkAttendance} style={styles.Icons} contentFit="contain" />
        <Text style={styles.tilesText}>Mark Attendance</Text>
      </Pressable>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/AttendanceRecord')}>
        <Image source={AttendanceRecords} style={styles.Icons} contentFit="contain" />
        <Text style={styles.tilesText}>Attendance Record</Text>
      </Pressable>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/LeaveRequestForm')}>
        <Image source={LeaveRequest} style={styles.Icons} contentFit="contain" />
        <Text style={styles.tilesText}>Apply Leave</Text>
      </Pressable>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/LeaveBalance')}>
        <Image source={LeavesRecord} style={styles.Icons} contentFit="contain" />
        <Text style={styles.tilesText}>Leaves Record</Text>
      </Pressable>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/TimesheetEntry')}>
        <Image source={LogTimesheet} style={styles.Icons} contentFit="contain" />
        <Text style={styles.tilesText}>Log Timesheet</Text>
      </Pressable>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/TimesheetList')}>
        <Image source={TimesheetRecords} style={styles.Icons} contentFit="contain" />
        <Text style={styles.tilesText}>Timesheet Record</Text>
      </Pressable>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/PayrollList')}>
        <Image source={Payroll} style={styles.Icons} contentFit="contain" />
        <Text style={styles.tilesText}>Payslips</Text>
      </Pressable>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  Main: {
    marginTop: 120,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dashboardTile: {
    height: 120,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    backgroundColor: 'rgba(105, 123, 228, 1)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  Icons: {
    height:80,
    width:80,
    marginBottom: 10,
  },
  tilesText:{
    fontWeight:"bold",
    color:"white"
  }
});
