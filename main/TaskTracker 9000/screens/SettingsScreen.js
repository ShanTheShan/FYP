import { React, useState, useEffect, useMemo, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Modal,
} from "react-native";

import { Cell, Section, TableView } from "react-native-tableview-simple";
import { themeContext } from "../context/themeContext";

const handleTurnNotificationsOn = async () => {
  await Linking.openSettings();
};

export default function SettingsScreen() {
  //retrieve global theme state
  const { currentTheme, setCurrentTheme } = useContext(themeContext);

  //create a project state modal
  const [themeModal, toggleThemeModal] = useState(false);

  //for radio buttons selection
  const [selectedId, setSelectedId] = useState();

  //theme state color
  const [darkState, setDarkState] = useState(true);
  const [lightState, setLightState] = useState(false);

  //handle theme saving when "Done" is pressed in modal
  const setTheme = () => {
    if (darkState == true && lightState == false) {
      setCurrentTheme("dark");
      toggleThemeModal(false);
    }

    if (darkState == false && lightState == true) {
      setCurrentTheme("light");
      toggleThemeModal(false);
    }
  };

  const handleThemeTouch = (theme) => {
    if (theme === "dark") {
      setLightState(false);
      setDarkState(!darkState);
    }

    if (theme === "light") {
      setLightState(!lightState);
      setDarkState(false);
    }
  };

  return (
    <SafeAreaView style={currentTheme === "dark" ? styles.safeAreaDark : styles.safeAreaLight}>
      <View style={styles.navigationView}>
        <Text style={styles.PageTitle}>Settings</Text>
      </View>
      <View style={styles.settingsContainer}>
        <TableView>
          {/* if theme pressed, launch modal */}
          {themeModal ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={themeModal}
              statusBarTranslucent={true}
            >
              <View style={styles.themeModalContainer}>
                <View style={styles.themeModalView}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 22, paddingTop: 5 }}>Choose theme</Text>
                  </View>
                  <View style={{ flex: 4, justifyContent: "center", alignItems: "center" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleThemeTouch("dark")}
                        style={darkState ? styles.themeTextPressed : styles.themeTextUnpressed}
                      >
                        <Text style={{ fontSize: 17 }}>Dark</Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleThemeTouch("light")}
                        style={lightState ? styles.themeTextPressed : styles.themeTextUnpressed}
                      >
                        <Text style={{ fontSize: 17 }}>Light</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ flex: 2 }}>
                    <TouchableOpacity
                      style={{ backgroundColor: "green", borderRadius: 10, margin: 10 }}
                      onPress={() => setTheme()}
                    >
                      <Text style={{ fontSize: 15, padding: 10 }}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          ) : (
            <Section>
              <Cell
                contentContainerStyle={{ height: 70 }}
                onPress={handleTurnNotificationsOn}
                cellContentView={
                  <Text
                    style={{ fontSize: 17, color: currentTheme === "dark" ? "white" : "black" }}
                  >
                    Notifications
                  </Text>
                }
                backgroundColor={currentTheme === "dark" ? "#1C1C1C" : "#F6F6F6"}
              />
              <Cell
                contentContainerStyle={{ height: 70 }}
                onPress={() => {
                  toggleThemeModal(true);
                }}
                cellContentView={
                  <Text
                    style={{ fontSize: 17, color: currentTheme === "dark" ? "white" : "black" }}
                  >
                    Theme
                  </Text>
                }
                backgroundColor={currentTheme === "dark" ? "#1C1C1C" : "#F6F6F6"}
              />
              <Cell
                contentContainerStyle={{ height: 70 }}
                cellContentView={
                  <Text
                    style={{ fontSize: 17, color: currentTheme === "dark" ? "white" : "black" }}
                  >
                    Replay Tutorial
                  </Text>
                }
                backgroundColor={currentTheme === "dark" ? "#1C1C1C" : "#F6F6F6"}
              />
            </Section>
          )}
        </TableView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaLight: {
    flex: 1,
    height: "100%",
  },
  safeAreaDark: {
    flex: 1,
    height: "100%",
    backgroundColor: "#141414",
  },
  navigationView: {
    flex: 1,
    backgroundColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsContainer: {
    flex: 5,
    margin: 20,
  },
  PageTitle: {
    fontSize: 30,
    color: "black",
    paddingTop: "10%",
  },
  themeModalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  themeModalView: {
    backgroundColor: "lightgrey",
    height: "30%",
    width: "70%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  radioGroup: {
    flex: 1,
    marginVertical: "10%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  themeTextPressed: {
    marginVertical: 10,
    borderRadius: 2,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 2,
    backgroundColor: "gold",
  },
  themeTextUnpressed: {
    marginVertical: 10,
    borderRadius: 2,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 2,
    backgroundColor: "white",
  },
});
