import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomHeader from "../Components/CustomHeader";
import { getHeaderTitle } from "@react-navigation/elements";
import CustomDrawer from "../Components/CustomDrawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { StatusBar } from "react-native";
export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle={'light-content'}/>
      <Drawer
        screenOptions={{
          headerShown: true,
          headerTransparent: true,
          header: ({ navigation, route, options }) => (
            <CustomHeader title={getHeaderTitle(options, route.name)} />
          ),
        }}
        drawerContent={(props: DrawerContentComponentProps) => (
          <CustomDrawer {...props} />
        )}
      >
        <Drawer.Screen
          name="Dashboard"
          options={{
            drawerLabel: "Dashboard",
            title: "Dashboard",
          }}
        />
        <Drawer.Screen
          name="Settings"
          options={{
            drawerLabel: "Profile",
            title: "Profile",
          }}
        />
        <Drawer.Screen
          name="AttendanceForm"
          options={{
            drawerLabel: "Mark Attendance",
            title: "Mark Attendance",
          }}
        />
        <Drawer.Screen
          name="AttendanceRecord"
          options={{
            drawerLabel: "Attendance Record",
            title: "Attendance Record",
          }}
        />
        <Drawer.Screen
          name="LeaveRequestForm"
          options={{
            drawerLabel: "Apply Leave",
            title: "Apply Leave",
          }}
        />
        <Drawer.Screen
          name="LeaveBalance"
          options={{
            drawerLabel: "Leaves Record",
            title: "Leaves Record",
          }}
        />
        <Drawer.Screen
          name="TimesheetEntry"
          options={{
            drawerLabel: "Log Timesheet",
            title: "Log Timesheet",
          }}
        />
        <Drawer.Screen
          name="TimesheetList"
          options={{
            drawerLabel: "Timesheet Record",
            title: "Timesheet Record",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
