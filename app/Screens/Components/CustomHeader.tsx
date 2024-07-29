import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import userStore from "../../stores/userStore";
import { observer } from "mobx-react-lite";
import { BellIcon, MenuIconPng, SearchIcon } from "../../../assets";
interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = observer(({ title }) => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={["rgba(82, 100, 204, 1)", "rgba(105, 123, 228, 1)"]}
      style={styles.header}
    >
      <View style={styles.HeadView1}>
        <Pressable
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <Image
            source={MenuIconPng}
            style={styles.MenuIcon}
          />
        </Pressable>
        <Text style={styles.HeadText}>{title}</Text>
      </View>
      <View style={styles.HeadView2}>
        <Pressable onPress={() => userStore.setShowSearch()}>
          <Image
            source={SearchIcon}
            style={styles.SearchIcon}
          />
        </Pressable>
        <Image
          source={BellIcon}
          style={styles.BellIcon}
        />
      </View>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  header: {
    borderBottomRightRadius: 44,
    borderBottomLeftRadius: 44,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 40,
    height: 100,
    backgroundColor:"white"
  },
  HeadView1: {
    flexDirection: "row",
  },
  HeadView2: {
    flexDirection: "row",
    gap: 20,
    paddingBottom: 20,
    paddingRight: 40,
  },
  HeadText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
    padding: 18,
  },
  MenuIcon: {
    objectFit: "contain",
    paddingBottom: 65,
  },
  SearchIcon: {
    objectFit: "contain",
    padding: 12,
  },
  BellIcon: {
    objectFit: "cover",
    padding: 12,
  },
});

export default CustomHeader;
