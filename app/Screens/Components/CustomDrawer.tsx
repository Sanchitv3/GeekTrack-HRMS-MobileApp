import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { observer } from "mobx-react-lite";
import userStore from "../../stores/userStore";
import { Image } from "expo-image";
import { router } from "expo-router";

const CustomDrawer = observer((props: DrawerContentComponentProps) => {
  return (
    <View style={styles.Main}>
      <LinearGradient
        colors={["rgba(82, 100, 204, 1)", "rgba(105, 123, 228, 1)"]}
        style={styles.header}
      >
        <Pressable
          onPress={() => router.push("/Screens/DrawerScreens/Settings")}
        >
          <View style={styles.userInfo}>
            <Image
              source={userStore.userPhoto}
              style={styles.userImage}
              alt="User Photo"
            />
            <Text style={styles.userName}>{userStore.userName}</Text>
          </View>
        </Pressable>
      </LinearGradient>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props}/>
      </DrawerContentScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  Main: {
    flex: 1,
  },
  header: {
    borderBottomRightRadius: 44,
    borderBottomLeftRadius: 44,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 20,
    height: 150,
    paddingVertical: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  userName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default CustomDrawer;
