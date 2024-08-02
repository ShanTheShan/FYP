import { React, useState, useContext, useEffect } from "react";
import { Text, View, TouchableHighlight, SafeAreaView } from "react-native";
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
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    return (
      <Text
        style={
          currentTheme === "dark" ? timerScreenStyles.digitsDark : timerScreenStyles.digitsLight
        }
      >{`${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}</Text>
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
      setActivity("working");
      return;
    }
    //time to rest
    else {
      //increment unique key count, to start timer again
      resetState((prevKey) => prevKey + 1);
      setDuration(restDuration);
      setActivity("resting");
    }
  }

  return (
    <SafeAreaView style={timerScreenStyles.container}>
      <View
        style={
          currentTheme === "dark"
            ? timerScreenStyles.timerViewDark
            : timerScreenStyles.timerViewLight
        }
      >
        <View style={{ flex: 2, justifyContent: "center" }}>
          <Entypo name="info-with-circle" size={24} color="white" />
        </View>
        <View style={{ flex: 5, alignItems: "center" }}>
          <CountdownCircleTimer
            key={time}
            isPlaying={timerState}
            duration={duration}
            colors={["blue"]}
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
