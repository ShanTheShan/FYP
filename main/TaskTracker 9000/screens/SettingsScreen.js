import { React, useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";

export default function SettingsScreen({}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navigationView}>
        <Text style={styles.PageTitle}>Settings</Text>
      </View>
      <View style={styles.settingsContainer}>
        <Text>My app</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: "100%",
  },
  navigationView: {
    flex: 1,
    backgroundColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsContainer: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "red",
  },
  PageTitle: {
    fontSize: 30,
    color: "black",
  },
});
