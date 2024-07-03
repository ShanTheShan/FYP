import { React, useState, useContext } from "react";
import { StyleSheet, Text, View, Button, SafeAreaView, Alert } from "react-native";

import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

import { themeContext } from "../context/themeContext";

//timer page main screen
function TimerScreen() {
  const { currentTheme } = useContext(themeContext);

  //button state
  const [timerState, setState] = useState(false);
  //button duration
  const [duration, setDuration] = useState(2);
  //button reset
  const [time, resetState] = useState(0);

  //funtion to reformt time
  const children = ({ remainingTime }) => {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    return (
      <Text style={{ fontSize: 30 }}>{`${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`}</Text>
    );
  };

  //calling two functions at once, when reset button press
  function resetHandler() {
    setState(false);
    setDuration(2);
    resetState((prevKey) => prevKey + 1);
  }

  //when 52 minutes is done
  function startResting() {
    //check if rest duration is time
    if (duration == 10) return;

    //increment unique key count, to start timer again
    resetState((prevKey) => prevKey + 1);
    //change 52 mins to 17 mins
    setDuration(10);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={currentTheme === "dark" ? styles.timerViewDark : styles.timerViewLight}>
        <View>
          <CountdownCircleTimer
            key={time}
            isPlaying={timerState}
            duration={duration}
            colors={["blue"]}
            onComplete={() => startResting()}
          >
            {children}
          </CountdownCircleTimer>
        </View>
        <View style={{ flexDirection: "row", padding: 10 }}>
          <Button color={"green"} title="START" onPress={() => setState(true)}></Button>
          <Button title="STOP" onPress={() => setState(false)}></Button>
        </View>
        <Button color={"red"} title="RESET" onPress={() => resetHandler()}></Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  timerViewDark: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C1C1C",
  },
  timerViewLight: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});

export default TimerScreen;
