import { React, useState, useContext } from "react";
import { Text, View, SafeAreaView, TouchableOpacity, Linking, Modal } from "react-native";
import WheelPicker from "react-native-wheely";

import { Cell, Section } from "react-native-tableview-simple";
import { themeContext } from "../context/themeContext";
import { timerContext } from "../context/timerContext";
import { settingStyles } from "./styles/SettingsScreenStyles";
import { TutorialModal } from "../components/tutorialModal";
import { times } from "../constants/timePreset";

const handleTurnNotificationsOn = async () => {
  await Linking.openSettings();
};

export default function SettingsScreen() {
  //retrieve global theme state
  const { currentTheme, setCurrentTheme } = useContext(themeContext);
  const { setWorkDuration, setRestDuration } = useContext(timerContext);

  //create a project state modal
  const [themeModal, toggleThemeModal] = useState(false);
  const [tutorialModal, toggleTutorialModal] = useState(false);
  const [timerModal, toggleTimerModal] = useState(false);

  //theme state color
  const [darkState, setDarkState] = useState(true);
  const [lightState, setLightState] = useState(false);

  //wheely
  const [workMinutes, setWorkMinutes] = useState(0);
  const [restMinutes, setRestMinutes] = useState(0);

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

  const handleTimerPrest = () => {
    toggleTimerModal(!timerModal);
    //convert string to integer seconds
    const workTime_toSeconds = times[workMinutes] * 60;
    const restTime_toSeconds = times[restMinutes] * 60;
    setWorkDuration(workTime_toSeconds);
    setRestDuration(restTime_toSeconds);
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
          {/* if theme pressed, launch modal */}
          <Section>
            <Cell
              contentContainerStyle={{ height: 70 }}
              onPress={handleTurnNotificationsOn}
              cellContentView={
                <Text style={{ fontSize: 17, color: currentTheme === "dark" ? "white" : "black" }}>
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
                <Text style={{ fontSize: 17, color: currentTheme === "dark" ? "white" : "black" }}>
                  Theme
                </Text>
              }
              backgroundColor={currentTheme === "dark" ? "#1C1C1C" : "#F6F6F6"}
            />
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
            ) : null}
            <Cell
              contentContainerStyle={{ height: 70 }}
              onPress={() => {
                toggleTimerModal(true);
              }}
              cellContentView={
                <Text style={{ fontSize: 17, color: currentTheme === "dark" ? "white" : "black" }}>
                  Timer
                </Text>
              }
              backgroundColor={currentTheme === "dark" ? "#1C1C1C" : "#F6F6F6"}
            />
            {timerModal ? (
              <Modal
                animationType="fade"
                transparent={true}
                visible={timerModal}
                statusBarTranslucent={true}
              >
                <View style={settingStyles.themeModalContainer}>
                  <View style={settingStyles.timerModalView}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-evenly",
                      }}
                    >
                      {/* row view with 2 columns inside, one for each wheely*/}
                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "center",
                          marginRight: 5,
                        }}
                      >
                        <Text style={{ fontSize: 15 }}>Work</Text>
                        <WheelPicker
                          selectedIndex={workMinutes}
                          options={times}
                          onChange={(index) => setWorkMinutes(index)}
                          containerStyle={{
                            marginHorizontal: 10,
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "center",
                          marginLeft: 5,
                        }}
                      >
                        <Text style={{ fontSize: 15 }}>Rest</Text>
                        <WheelPicker
                          selectedIndex={restMinutes}
                          options={times}
                          onChange={(index) => setRestMinutes(index)}
                          containerStyle={{
                            marginHorizontal: 10,
                          }}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{ backgroundColor: "green", borderRadius: 10, margin: 10 }}
                      onPress={() => handleTimerPrest()}
                    >
                      <Text style={{ fontSize: 15, padding: 10 }}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            ) : null}
            <Cell
              contentContainerStyle={{ height: 70 }}
              onPress={() => {
                toggleTutorialModal(true);
              }}
              cellContentView={
                <Text style={{ fontSize: 17, color: currentTheme === "dark" ? "white" : "black" }}>
                  Replay Tutorial
                </Text>
              }
              backgroundColor={currentTheme === "dark" ? "#1C1C1C" : "#F6F6F6"}
            />
          </Section>
        </View>
      )}
    </SafeAreaView>
  );
}
