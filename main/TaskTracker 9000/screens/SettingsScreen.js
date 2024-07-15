import { React, useState, useContext } from "react";
import { Text, View, SafeAreaView, TouchableOpacity, Linking, Modal } from "react-native";

import { Cell, Section, TableView } from "react-native-tableview-simple";
import { themeContext } from "../context/themeContext";
import { settingStyles } from "./styles/SettingsScreenStyles";
import { TutorialModal } from "../components/tutorialModal";

const handleTurnNotificationsOn = async () => {
  await Linking.openSettings();
};

export default function SettingsScreen() {
  //retrieve global theme state
  const { currentTheme, setCurrentTheme } = useContext(themeContext);

  //create a project state modal
  const [themeModal, toggleThemeModal] = useState(false);
  const [tutorialModal, toggleTutorialModal] = useState(false);

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
    <SafeAreaView
      style={currentTheme === "dark" ? settingStyles.safeAreaDark : settingStyles.safeAreaLight}
    >
      <View style={settingStyles.navigationView}>
        <Text style={settingStyles.PageTitle}>Settings</Text>
      </View>
      {/* if tutorial pressed, launch tutorial modal */}
      {tutorialModal ? (
        <TutorialModal modalVisible={tutorialModal} setModalVisible={toggleTutorialModal} />
      ) : (
        <View style={settingStyles.settingsContainer}>
          <TableView>
            {/* if theme pressed, launch modal */}
            {themeModal ? (
              <Modal
                animationType="fade"
                transparent={true}
                visible={themeModal}
                statusBarTranslucent={true}
              >
                <View style={settingStyles.themeModalContainer}>
                  <View style={settingStyles.themeModalView}>
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
                          style={
                            darkState
                              ? settingStyles.themeTextPressed
                              : settingStyles.themeTextUnpressed
                          }
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
                          style={
                            lightState
                              ? settingStyles.themeTextPressed
                              : settingStyles.themeTextUnpressed
                          }
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
                  onPress={() => {
                    toggleTutorialModal(true);
                  }}
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
      )}
    </SafeAreaView>
  );
}
