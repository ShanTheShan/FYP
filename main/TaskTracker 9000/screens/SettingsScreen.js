import { React, useState, useContext, useEffect } from "react";
import { Text, View, SafeAreaView, TouchableOpacity, Linking, Modal } from "react-native";
import * as MailComposer from "expo-mail-composer";
import WheelPicker from "react-native-wheely";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TableView, Cell, Section } from "react-native-tableview-simple";
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

  //all modals
  const [themeModal, toggleThemeModal] = useState(false);
  const [tutorialModal, toggleTutorialModal] = useState(false);
  const [timerModal, toggleTimerModal] = useState(false);
  const [infoModal, toggleInfoModal] = useState(false);

  //theme state color
  const [darkState, setDarkState] = useState(false);
  const [lightState, setLightState] = useState(false);

  //wheely
  const [workMinutes, setWorkMinutes] = useState(0);
  const [restMinutes, setRestMinutes] = useState(0);

  //check what theme we are on from cache, then set the theme state color
  useEffect(() => {
    const fetchThemeCache = async () => {
      try {
        const value = await AsyncStorage.getItem("light");
        if (value === "true") {
          setLightState(true);
        } else {
          setDarkState(true);
        }
      } catch (error) {
        console.error("Error loading theme in Settings -> fetchThemeCache():", error);
      }
    };
    fetchThemeCache();
  }, []);

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

  const handleThemeTouch = async (theme) => {
    if (theme === "dark") {
      setLightState(false);
      setDarkState(!darkState);
      await AsyncStorage.setItem("light", "false");
    }

    if (theme === "light") {
      setLightState(!lightState);
      setDarkState(false);
      await AsyncStorage.setItem("light", "true");
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

  const launchEmail = () => {
    MailComposer.composeAsync({
      subject: "TaskTracker 9000 Feedback",
      recipients: ["shanath_98@protonmail.com"],
    });
  };

  return (
    <SafeAreaView
      style={currentTheme === "dark" ? settingStyles.safeAreaDark : settingStyles.safeAreaLight}
    >
      <View
        style={
          currentTheme === "dark"
            ? settingStyles.navigationViewDark
            : settingStyles.navigationViewLight
        }
      >
        <Text
          style={{
            fontSize: 30,
            color: currentTheme === "dark" ? "white" : "black",
            paddingTop: "10%",
          }}
        >
          Settings
        </Text>
      </View>
      <View style={settingStyles.settingsContainer}>
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
                    <Text style={{ fontSize: 15, padding: 10, color: "white" }}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        ) : null}
        {infoModal ? (
          <Modal
            animationType="fade"
            transparent={true}
            visible={infoModal}
            statusBarTranslucent={true}
          >
            <View style={settingStyles.themeModalContainer}>
              <View style={settingStyles.themeModalView}>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "400",
                    paddingHorizontal: 10,
                  }}
                >
                  It is recommended to set battery optimization to unrestricted in the Notifications
                  Settings of this app. This ensures you receive all your reminders on time and
                  without delay.
                </Text>
                <TouchableOpacity
                  style={{ backgroundColor: "green", borderRadius: 10, margin: 10 }}
                  onPress={() => toggleInfoModal(false)}
                >
                  <Text style={{ fontSize: 15, padding: 10, color: "white" }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : null}
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
                  <Text style={{ fontSize: 15, padding: 10, color: "white" }}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : null}
        {tutorialModal ? (
          <TutorialModal modalVisible={tutorialModal} setModalVisible={toggleTutorialModal} />
        ) : null}
        <TableView
          appearance={"customKey"}
          customAppearances={{
            customKey: {
              colors: {
                background: currentTheme === "dark" ? "black" : "white",
                separatorColor: currentTheme === "dark" ? "white" : "black",
                body: currentTheme === "dark" ? "white" : "black",
                secondary: currentTheme === "dark" ? "white" : "black",
              },
            },
          }}
        >
          <Section footer="TaskTracker 9000 v1.0.0">
            <Cell
              title="Notifications"
              onPress={handleTurnNotificationsOn}
              titleTextStyle={{ paddingVertical: 10 }}
            />
            <Cell
              title="Reminder Info"
              onPress={() => {
                toggleInfoModal(true);
              }}
              titleTextStyle={{ paddingVertical: 10 }}
            />
            <Cell
              title="Theme"
              onPress={() => {
                toggleThemeModal(true);
              }}
              titleTextStyle={{ paddingVertical: 10 }}
            />
            <Cell
              title="Timer"
              onPress={() => {
                toggleTimerModal(true);
              }}
              titleTextStyle={{ paddingVertical: 10 }}
            />
            <Cell
              title="Replay Tutorial"
              onPress={() => {
                toggleTutorialModal(true);
              }}
              titleTextStyle={{ paddingVertical: 10 }}
            />
            <Cell
              title="Send Feedback"
              onPress={launchEmail}
              titleTextStyle={{ paddingVertical: 10 }}
            />
            <Cell
              title="Privacy Policy"
              onPress={() => {
                Linking.openURL("https://sites.google.com/view/gammadigital-tasktracker9000");
              }}
              titleTextStyle={{ paddingVertical: 10 }}
            />
          </Section>
        </TableView>
      </View>
    </SafeAreaView>
  );
}
