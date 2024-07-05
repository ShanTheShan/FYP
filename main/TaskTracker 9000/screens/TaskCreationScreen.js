import { React, useState, useEffect, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Modal,
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

  //subtasks states
  const [subTasksModal, setSubTasksModalVisible] = useState(false);
  const [input, setInput] = useState("");
  const [subTaskArray, setSubTaskArray] = useState([]);

  //SQLite query to insert task to project
  const insertTaskQuery = () => {
    //the '@#' symbol is used as a separator
    let deadlineValue = dateFormatted + " | " + timeFormatted;
    let subtasksValue = subTaskArray.join("@#");
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
      //empty datetime, subtask, images and reminder, for new input
      setTimeFormater(null);
      setDateFormater(null);
      setSubTaskArray([]);
    } catch (error) {
      console.log(error);
    }
  };

  //this function is ran when enter sub task is pressed in sub task modal
  const createSubTask = (value) => {
    setSubTaskArray((oldArray) => [...oldArray, value]);
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
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => setSubTasksModalVisible(true)}
          >
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
          {subTaskArray.length != 0 ? (
            <View style={taskCreationScreenStyles.subTaskView}>
              {subTaskArray.map((item, i) => {
                return (
                  <Text
                    key={i}
                    style={
                      currentTheme === "dark"
                        ? taskCreationScreenStyles.subTaskDark
                        : taskCreationScreenStyles.subTaskLight
                    }
                  >
                    {item}
                  </Text>
                );
              })}
            </View>
          ) : null}
          {subTasksModal ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={subTasksModal}
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
                      ? taskCreationScreenStyles.subTasksModalDarkView
                      : taskCreationScreenStyles.subTasksModalLightView
                  }
                >
                  <TextInput
                    style={
                      currentTheme === "dark"
                        ? taskCreationScreenStyles.subTasksTextInputDark
                        : taskCreationScreenStyles.subTasksTextInputLight
                    }
                    placeholder="Enter sub task..."
                    onChangeText={(newText) => setInput(newText)}
                    placeholderTextColor={currentTheme === "dark" ? "white" : "black"}
                    defaultValue={input}
                  />
                  <TouchableOpacity
                    style={taskCreationScreenStyles.buttonEnter}
                    onPress={() => {
                      setSubTasksModalVisible(false);
                      createSubTask(input);
                      setInput("");
                    }}
                  >
                    <Text style={{ color: "white" }}>Create Sub Task</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={taskCreationScreenStyles.buttonClose}
                    onPress={() => {
                      setSubTasksModalVisible(false);
                      setInput("");
                    }}
                  >
                    <Text style={{ color: "white" }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          ) : null}
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
