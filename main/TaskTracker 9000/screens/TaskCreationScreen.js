import { React, useState, useEffect, useContext } from "react";
import { Text, View, Image, TextInput, SafeAreaView, TouchableOpacity, Modal } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { db } from "../constants/database";
import { usePushNotifications, createNotification } from "../constants/push";

import { themeContext } from "../context/themeContext";
import { animationContext } from "../context/animationContext";
import { taskCreationScreenStyles } from "./styles/TaskCreationScreenStyles";
import { AddButton } from "../components/customButtons";
import { TextValidator, ActionDone } from "../components/customTextValidator";
import { ReminderTouchable, CameraTouchable, DeadlineTouchable } from "../components/taskCreation";

export default function ProjectTaskScreen({ navigation, route }) {
  //trigger request for notification permission
  const { expoPushToken, notification } = usePushNotifications();

  //if screen is focused
  const isFocused = useIsFocused();

  //the project id we a creating a task for
  const { id, photoUri } = route.params;

  //global theme state
  const { currentTheme } = useContext(themeContext);
  //global animation state
  const { setToggleValidator } = useContext(animationContext);
  const { setToggleActionDone } = useContext(animationContext);

  //text input state
  const [task, createTask] = useState("");

  //----------------------------------

  //PLS READ ---> the calendar codes for deadline and reminde are exactly the same
  //         ---> i hard coded and replicates all the same code, but renamed them,
  //         ---> so essentially, i have two calendars, calling the exact same functions, but renamed
  //         ---> pls try to refactor, to just use one calendar, by storing data in different states
  //         ---> depending if deadline or reminde was pressed, passing id works, but its resets the dates

  //date time states for deadline
  const [date, setDate] = useState(new Date());
  const [dateFormatted, setDateFormater] = useState(null);

  const [time, setTime] = useState(new Date());
  const [timeFormatted, setTimeFormater] = useState(null);

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  //----------------------------

  //date time states for reminder
  const [dateReminder, setDateReminder] = useState(new Date());
  const [dateReminderFormatted, setReminderDateFormated] = useState(null);

  const [timeReminder, setTimeReminder] = useState(new Date());
  const [timeReminderFormatted, setReminderTimeFormated] = useState(null);

  const [modeReminder, setModeReminder] = useState("date");
  const [showReminder, setShowReminder] = useState(false);

  //--------------------------------------

  //subtasks states
  const [subTasksModal, setSubTasksModalVisible] = useState(false);
  const [input, setInput] = useState("");
  const [subTaskArray, setSubTaskArray] = useState([]);

  //image state
  const [imagePreview, setImagePreview] = useState(false);
  useEffect(() => {
    if (photoUri != null && isFocused == true) setImagePreview(true);
  }, [isFocused]);

  //SQLite query to insert task to project
  const insertTaskQuery = () => {
    //the '@#' symbol is used as a separator
    let deadlineValue = dateFormatted + " | " + timeFormatted;
    let subtasksValue = subTaskArray.join("@#");
    let reminderValue = dateReminderFormatted;
    let notesValue = null;
    let imageValue = null;
    let completedValue = "no";

    //check if text input is empty
    if (!task) {
      setToggleValidator(true);
      setTimeout(() => {
        setToggleValidator(false);
      }, 2000);
      return;
    }

    //if we have an image, store it
    if (photoUri != null || photoUri != undefined) imageValue = photoUri.uri;

    //if we have a reminder, create a reminder schedule notification
    if (reminderValue != null || reminderValue != undefined) {
      createNotification(dateReminderFormatted, timeReminderFormatted);
    }

    try {
      db.runSync(
        "INSERT INTO ProjectDetails (projectId, tasks,subtasks,deadline,reminder,notes,image,completed) VALUES (?,?,?,?,?,?,?,?)",
        [
          id,
          task,
          subtasksValue,
          deadlineValue,
          reminderValue,
          notesValue,
          imageValue,
          completedValue,
        ]
      );
      //empty the text input so we can type again
      createTask("");
      //empty datetime, subtask, images and reminder, for new input
      setTimeFormater(null);
      setDateFormater(null);
      setReminderDateFormated(null);
      setReminderTimeFormated(null);
      setSubTaskArray([]);
      setImagePreview(false);

      //toggle the added animation
      setToggleActionDone(true);
      setTimeout(() => {
        setToggleActionDone(false);
      }, 2000);
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

  const onChangeDateReminder = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowReminder(false);
    setDateReminder(currentDate);
    //convert to string date
    const value = currentDate.toLocaleString("en-GB").split(",", 1)[0];
    setReminderDateFormated(value);
  };

  const onChangeTimeReminder = (event, selectedDate) => {
    const currentTime = selectedDate;
    setShowReminder(false);
    setTimeReminder(currentTime);
    const value = currentTime.toTimeString().slice(0, 5);
    setReminderTimeFormated(value);
  };

  const showModeReminder = (currentMode) => {
    setShowReminder(true);
    setModeReminder(currentMode);
  };

  const showDatepickerReminder = () => {
    showModeReminder("date");
  };

  const showTimepickerReminder = () => {
    showModeReminder("time");
  };

  const resetElement = (id) => {
    switch (id) {
      case 1:
        setDateFormater(null);
        setTimeFormater(null);
        break;
      case 2:
        setReminderDateFormated(null);
        setReminderTimeFormated(null);
        break;
    }
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
          <DeadlineTouchable
            styles={taskCreationScreenStyles}
            currentTheme={currentTheme}
            showDatepicker={showDatepicker}
          />
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
                <>
                  <Text
                    style={
                      currentTheme === "dark"
                        ? taskCreationScreenStyles.timeDark
                        : taskCreationScreenStyles.timeLight
                    }
                  >
                    {timeFormatted}
                  </Text>
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={() => resetElement(1)}
                  >
                    <Text
                      style={
                        currentTheme === "dark"
                          ? taskCreationScreenStyles.timeTouchableDark
                          : taskCreationScreenStyles.timeTouchableLight
                      }
                    >
                      ❌
                    </Text>
                  </TouchableOpacity>
                </>
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
          <CameraTouchable
            styles={taskCreationScreenStyles}
            currentTheme={currentTheme}
            navigation={navigation}
            id={id}
          />
          {imagePreview != false ? (
            <View style={taskCreationScreenStyles.imagePreviewView}>
              <Image
                source={{ uri: photoUri && photoUri.uri }}
                style={taskCreationScreenStyles.imagePreview}
              />
            </View>
          ) : null}
        </View>
        <View
          style={
            currentTheme === "dark"
              ? taskCreationScreenStyles.bulletsDark
              : taskCreationScreenStyles.bulletsLight
          }
        >
          <ReminderTouchable
            styles={taskCreationScreenStyles}
            currentTheme={currentTheme}
            showDatepickerReminder={showDatepickerReminder}
          />
          {dateReminderFormatted != null ? (
            <View style={taskCreationScreenStyles.dateTimeView}>
              <Text
                style={
                  currentTheme === "dark"
                    ? taskCreationScreenStyles.dateDark
                    : taskCreationScreenStyles.dateLight
                }
              >
                {dateReminderFormatted}
              </Text>
              {timeReminderFormatted != null ? (
                <>
                  <Text
                    style={
                      currentTheme === "dark"
                        ? taskCreationScreenStyles.timeDark
                        : taskCreationScreenStyles.timeLight
                    }
                  >
                    {timeReminderFormatted}
                  </Text>
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={() => resetElement(2)}
                  >
                    <Text
                      style={
                        currentTheme === "dark"
                          ? taskCreationScreenStyles.timeTouchableDark
                          : taskCreationScreenStyles.timeTouchableLight
                      }
                    >
                      ❌
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={{ flexDirection: "row" }} onPress={showTimepickerReminder}>
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
          {showReminder ? (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateReminder}
              mode={modeReminder}
              is24Hour={true}
              onChange={modeReminder == "date" ? onChangeDateReminder : onChangeTimeReminder}
            />
          ) : null}
        </View>
      </View>
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <TextValidator value="Task" currentTheme={currentTheme} />
        <ActionDone value="Task" currentTheme={currentTheme} />
        <AddButton press={() => insertTaskQuery()} />
      </View>
    </SafeAreaView>
  );
}
