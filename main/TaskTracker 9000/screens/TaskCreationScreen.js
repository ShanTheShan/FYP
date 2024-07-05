import { React, useState, useEffect, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { db } from "../constants/database";

import { themeContext } from "../context/themeContext";
import { AddButton } from "../components/customButtons";
import { taskCreationScreenStyles } from "./styles/TaskCreationScreenStyles";

export default function ProjectTaskScreen({ navigation, route }) {
  //the project id we a creating a task for
  const { id } = route.params;

  //global theme state
  const { currentTheme } = useContext(themeContext);

  //text input state
  const [task, createTask] = useState("");

  //date time states
  const [date, setDate] = useState(new Date());
  const [dateFormatted, setDateFormater] = useState(null);

  const [time, setTime] = useState(new Date());
  const [timeFormatted, setTimeFormater] = useState(null);

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  //SQLite query to insert task to project
  const insertTaskQuery = () => {
    //the '@' symbol is used as a separator
    let deadlineValue = dateFormatted + " | " + timeFormatted;
    let subtasksValue = null;
    let reminderValue = null;
    let notesValue = null;
    let imageValue = null;
    try {
      db.runSync(
        "INSERT INTO ProjectDetails (projectId, tasks,subtasks,deadline,reminder,notes,image) VALUES (?,?,?,?,?,?,?)",
        [id, task, subtasksValue, deadlineValue, reminderValue, notesValue, imageValue]
      );
      //empty the text input so we can type again
      createTask("");
    } catch (error) {
      console.log(error);
    }
  };

  //https://www.npmjs.com/package/@react-native-community/datetimepicker#usage

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    //convert to string date
    const value = currentDate.toLocaleString("en-GB").split(",", 1)[0];
    setDateFormater(value);
  };

  const onChangeTime = (event, selectedDate) => {
    const currentTime = selectedDate;
    setShow(false);
    setTime(currentTime);
    const value = currentTime.toTimeString().slice(0, 5);
    setTimeFormater(value);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <SafeAreaView
      style={
        currentTheme === "dark"
          ? taskCreationScreenStyles.safeAreaDark
          : taskCreationScreenStyles.safeAreaLight
      }
    >
      <View
        style={
          currentTheme === "dark"
            ? taskCreationScreenStyles.containerDark
            : taskCreationScreenStyles.containerLight
        }
      >
        <TextInput
          style={
            currentTheme === "dark"
              ? taskCreationScreenStyles.textInputDark
              : taskCreationScreenStyles.textInputLight
          }
          placeholder="Enter Task"
          onChangeText={(newText) => createTask(newText)}
          defaultValue={task}
        />
        <View
          style={
            currentTheme === "dark"
              ? taskCreationScreenStyles.bulletsDark
              : taskCreationScreenStyles.bulletsLight
          }
        >
          <TouchableOpacity style={{ flexDirection: "row" }} onPress={showDatepicker}>
            <Image
              source={require("../assets/deadline.png")}
              style={taskCreationScreenStyles.image}
            />
            <Text
              style={
                currentTheme === "dark"
                  ? taskCreationScreenStyles.bulletTextDark
                  : taskCreationScreenStyles.bulletTextLight
              }
            >
              Deadline
            </Text>
          </TouchableOpacity>
          {dateFormatted != null ? (
            <View style={taskCreationScreenStyles.dateTimeView}>
              <Text
                style={
                  currentTheme === "dark"
                    ? taskCreationScreenStyles.dateDark
                    : taskCreationScreenStyles.dateLight
                }
              >
                {dateFormatted}
              </Text>
              {timeFormatted != null ? (
                <Text
                  style={
                    currentTheme === "dark"
                      ? taskCreationScreenStyles.timeDark
                      : taskCreationScreenStyles.timeLight
                  }
                >
                  {timeFormatted}
                </Text>
              ) : (
                <TouchableOpacity style={{ flexDirection: "row" }} onPress={showTimepicker}>
                  <Text
                    style={
                      currentTheme === "dark"
                        ? taskCreationScreenStyles.timeTouchableDark
                        : taskCreationScreenStyles.timeTouchableLight
                    }
                  >
                    TIME
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
          {show ? (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={mode == "date" ? onChangeDate : onChangeTime}
            />
          ) : null}
        </View>
        <View
          style={
            currentTheme === "dark"
              ? taskCreationScreenStyles.bulletsDark
              : taskCreationScreenStyles.bulletsLight
          }
        >
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <Image
              source={require("../assets/subtasks.png")}
              style={taskCreationScreenStyles.image}
            />
            <Text
              style={
                currentTheme === "dark"
                  ? taskCreationScreenStyles.bulletTextDark
                  : taskCreationScreenStyles.bulletTextLight
              }
            >
              Sub Tasks
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={
            currentTheme === "dark"
              ? taskCreationScreenStyles.bulletsDark
              : taskCreationScreenStyles.bulletsLight
          }
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Camera", { pid: id })}
            style={{ flexDirection: "row" }}
          >
            <Image
              source={require("../assets/camera.png")}
              style={taskCreationScreenStyles.image}
            />
            <Text
              style={
                currentTheme === "dark"
                  ? taskCreationScreenStyles.bulletTextDark
                  : taskCreationScreenStyles.bulletTextLight
              }
            >
              Add Image
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={
            currentTheme === "dark"
              ? taskCreationScreenStyles.bulletsDark
              : taskCreationScreenStyles.bulletsLight
          }
        >
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <Image source={require("../assets/bell.png")} style={taskCreationScreenStyles.image} />
            <Text
              style={
                currentTheme === "dark"
                  ? taskCreationScreenStyles.bulletTextDark
                  : taskCreationScreenStyles.bulletTextLight
              }
            >
              Reminder
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <AddButton press={() => insertTaskQuery()} />
      </View>
    </SafeAreaView>
  );
}
