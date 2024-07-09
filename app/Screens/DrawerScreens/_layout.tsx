import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomHeader from "../Components/CustomHeader";
import { getHeaderTitle } from '@react-navigation/elements';
import CustomDrawer from "../Components/CustomDrawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
export default function Layout() {
  return (
    <GestureHandlerRootView style={{flex:1}}>
    <Drawer screenOptions={{headerShown:true,headerTransparent:true, header:({ navigation, route, options })=><CustomHeader title={getHeaderTitle(options,route.name)}/>}} drawerContent={(props:DrawerContentComponentProps)=><CustomDrawer {...props}/>} >
        <Drawer.Screen name="Dashboard" 
        options={{
            drawerLabel: "Dashboard",
            title: "Dashboard",
          }} />
          <Drawer.Screen name="Settings"
          options={{
            drawerLabel:"Profile",
            title:"Profile",
          }} />
          
    </Drawer>
    </GestureHandlerRootView>
  );
}