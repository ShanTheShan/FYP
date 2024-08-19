import { React, useState, useContext, useEffect } from "react";
import {
  Modal,
  Text,
  View,
  TouchableHighlight,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Vibration,
} from "react-native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useIsFocused } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";

import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

import { timerScreenStyles } from "./styles/TimerScreenStyles";
import { themeContext } from "../context/themeContext";
import { timerContext } from "../context/timerContext";

//timer page main screen
function TimerScreen() {
  const { currentTheme } = useContext(themeContext);
  const { workDuration, restDuration } = useContext(timerContext);

  const [infoModal, setInfoModal] = useState(false);

  //button state
  const [timerState, setState] = useState(false);
  //button duration
  const [duration, setDuration] = useState(workDuration);
  //button reset
  const [time, resetState] = useState(0);
  //activty, are in working or resting
  const [activity, setActivity] = useState("working");

  //if screen in focus, active keepawake
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
  }, [isFocused]);

  useEffect(() => {
    setDuration(workDuration);
  }, [workDuration]);

  //funtion to reformt time
  const children = ({ remainingTime }) => {
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    return (
      <Text
        style={
          currentTheme === "dark" ? timerScreenStyles.digitsDark : timerScreenStyles.digitsLight
        }
      >{`${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}</Text>
    );
  };

  //calling two functions at once, when reset button press
  function resetHandler() {
    setState(false);
    setActivity("working");
    setDuration(workDuration);
    resetState((prevKey) => prevKey + 1);
  }

  //when 52 minutes is done
  function startResting() {
    //rest over, back to work
    if (activity == "resting") {
      setState(false);
      setDuration(workDuration);
      resetState((prevKey) => prevKey + 1);
      setActivity("working");
      return;
    }
    //time to rest
    else {
      Vibration.vibrate(PATTERN);
      //increment unique key count, to start timer again
      resetState((prevKey) => prevKey + 1);
      setDuration(restDuration);
      setActivity("resting");
    }
  }

  //vibration pattern when its time to rest
  const PATTERN = [1000, 1500, 1000, 1500];

  return (
    <SafeAreaView style={timerScreenStyles.container}>
      <View
        style={
          currentTheme === "dark"
            ? timerScreenStyles.timerViewDark
            : timerScreenStyles.timerViewLight
        }
      >
        {infoModal ? (
          <Modal
            animationType="fade"
            transparent={true}
            visible={infoModal}
            statusBarTranslucent={true}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              }}
            >
              <View
                style={
                  currentTheme === "dark"
                    ? timerScreenStyles.infoModalDarkView
                    : timerScreenStyles.infoModalLightView
                }
              >
                <Text
                  style={{
                    color: currentTheme === "dark" ? "white" : "black",
                    textAlign: "center",
                    fontSize: 14,
                  }}
                  numberOfLines={5}
                  ellipsizeMode="tail"
                >
                  A time management tool for productivity that utilizes the 52/17 technique, where
                  you work for 52 minutes and rest for 17. You may adjust the timer presets in
                  Settings.
                </Text>
                <TouchableHighlight
                  style={timerScreenStyles.buttonEnter}
                  onPress={() => {
                    setInfoModal(!infoModal);
                  }}
                >
                  <Text style={{ color: "white" }}>Done</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        ) : null}
        <View style={{ flex: 2, justifyContent: "center" }}>
          <TouchableOpacity onPress={() => setInfoModal(!infoModal)}>
            <Entypo
              name="info-with-circle"
              size={30}
              color={currentTheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 5, alignItems: "center" }}>
          <CountdownCircleTimer
            key={time}
            isPlaying={timerState}
            duration={duration}
            //colors={["blue"]}
            colors={activity === "resting" ? "green" : "blue"}
            onComplete={() => startResting()}
            size={250}
            strokeWidth={15}
          >
            {children}
          </CountdownCircleTimer>
          <TouchableHighlight style={timerScreenStyles.startButton} onPress={() => setState(true)}>
            <Text style={{ color: "white" }}>START</Text>
          </TouchableHighlight>
          <TouchableHighlight style={timerScreenStyles.resetButton} onPress={() => resetHandler()}>
            <Text style={{ color: "white" }}>RESET</Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default TimerScreen;
