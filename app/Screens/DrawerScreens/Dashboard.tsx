import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { AttendanceRecords, LeaveRequest, LeavesRecord, LogTimesheet, MarkAttendance, Payroll, TimesheetRecords } from '../../../assets';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const Dashboard = () => {
  return (
    <View style={styles.Main}>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/AttendanceForm')}>
        <LinearGradient
          colors={['#007BFF', '#00C9FF']}
          style={[styles.dashboardTile, { borderRadius: 15 }]}
        >
          <Image source={MarkAttendance} style={styles.Icons} contentFit="contain" />
          <Text style={styles.tilesText}>Mark Attendance</Text>
        </LinearGradient>
      </Pressable>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/AttendanceRecord')}>
      <LinearGradient
          colors={['#007BFF', '#00C9FF']}
          style={[styles.dashboardTile, { borderRadius: 15 }]}
        >
        <Image source={AttendanceRecords} style={styles.Icons} contentFit="contain" />
        <Text style={styles.tilesText}>Attendance Record</Text>
        </LinearGradient>
      </Pressable>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/LeaveRequestForm')}>
      <LinearGradient
          colors={['#007BFF', '#00C9FF']}
          style={[styles.dashboardTile, { borderRadius: 15 }]}
        >
        <Image source={LeaveRequest} style={styles.Icons} contentFit="contain" />
        <Text style={styles.tilesText}>Apply Leave</Text>
        </LinearGradient>
      </Pressable>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/LeaveBalance')}>
      <LinearGradient
          colors={['#007BFF', '#00C9FF']}
          style={[styles.dashboardTile, { borderRadius: 15 }]}
        >
        <Image source={LeavesRecord} style={styles.Icons} contentFit="contain" />
        <Text style={styles.tilesText}>Leaves Record</Text>
        </LinearGradient>
      </Pressable>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/TimesheetEntry')}>
      <LinearGradient
          colors={['#007BFF', '#00C9FF']}
          style={[styles.dashboardTile, { borderRadius: 15 }]}
        >
        <Image source={LogTimesheet} style={styles.Icons} contentFit="contain" />
        <Text style={styles.tilesText}>Log Timesheet</Text>
        </LinearGradient>
      </Pressable>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/TimesheetList')}>
      <LinearGradient
          colors={['#007BFF', '#00C9FF']}
          style={[styles.dashboardTile, { borderRadius: 15 }]}
        >
        <Image source={TimesheetRecords} style={styles.Icons} contentFit="contain" />
        <Text style={styles.tilesText}>Timesheet Record</Text>
        </LinearGradient>
      </Pressable>
      <Pressable style={styles.dashboardTile} onPress={()=>router.push('Screens/DrawerScreens/PayrollList')}>
      <LinearGradient
          colors={['#007BFF', '#00C9FF']}
          style={[styles.dashboardTile, { borderRadius: 15 }]}
        >
        <Image source={Payroll} style={styles.Icons} contentFit="contain" />
        <Text style={styles.tilesText}>Payslips</Text>
        </LinearGradient>
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
    borderRadius: 10,
    backgroundColor:"transparent",
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
