import { React, useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { db } from "../constants/database";
import { usePushNotifications, createNotification } from "../constants/push";

import { themeContext } from "../context/themeContext";
import { animationContext } from "../context/animationContext";
import { taskCreationScreenStyles } from "./styles/TaskCreationScreenStyles";
import { AddButton } from "../components/customButtons";
import { TextValidator, ActionDone } from "../components/customTextValidator";
import {
  ReminderTouchable,
  SubTasksTouchable,
  CameraTouchable,
  DeadlineTouchable,
  CancelTouchable,
} from "../components/taskCreation";

export default function ProjectTaskScreen({ navigation, route }) {
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

  //PLS READ ---> the calendar codes for deadline and reminder are exactly the same
  //         ---> i replicated all the same code, but renamed them,
  //         ---> so essentially, i have two calendars, calling the exact same functions, but renamed
  //         ---> pls try to refactor, to just use one calendar, by storing data in different states
  //         ---> depending if deadline or reminder was pressed, passing id works, but its resets the dates

  //date time states for deadline
  const [date, setDate] = useState(new Date());
  const [dateFormatted, setDateFormater] = useState(null);

  const [time, setTime] = useState(new Date());
  const [timeFormatted, setTimeFormater] = useState(null);

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  //to automatically open time when datepick was set
  const [autoDeadline, setAutoTransitionDeadline] = useState(false);

  //----------------------------

  //date time states for reminder
  const [dateReminder, setDateReminder] = useState(new Date());
  const [dateReminderFormatted, setReminderDateFormated] = useState(null);

  const [timeReminder, setTimeReminder] = useState(new Date());
  const [timeReminderFormatted, setReminderTimeFormated] = useState(null);

  const [modeReminder, setModeReminder] = useState("date");
  const [showReminder, setShowReminder] = useState(false);

  //to automatically open time when datepick was set
  const [autoReminder, setAutoTransitionReminder] = useState(false);

  //--------------------------------------

  //subtasks states
  const [subTasksModal, setSubTasksModalVisible] = useState(false);
  const [input, setInput] = useState("");
  const [subTaskArray, setSubTaskArray] = useState([]);

  //image state
  const [imagePreview, setImagePreview] = useState(false);
  useEffect(() => {
    if (photoUri != undefined && isFocused == true) {
      setImagePreview(true);
    }
  }, [isFocused]);

  //SQLite query to insert task to project
  const insertTaskQuery = () => {
    //the '@#' symbol is used as a separator
    let deadlineValue = dateFormatted + " | " + timeFormatted;
    let reminderValue = dateReminderFormatted;
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

    //check of reminder has both date and time
    if (dateReminderFormatted != null && timeReminderFormatted === null) {
      setToggleValidator(true);
      setTimeout(() => {
        setToggleValidator(false);
      }, 2000);
      return;
    }

    //if we have an image, store it
    if (photoUri != undefined && imagePreview === true) {
      imageValue = photoUri.uri;
    }

    //if we have a reminder, create a reminder schedule notification
    if (reminderValue != null || reminderValue != undefined) {
      createNotification(dateReminderFormatted, timeReminderFormatted, task);
    }

    try {
      db.withTransactionAsync(async () => {
        await db.runAsync(
          "INSERT INTO ProjectDetails (project_id , task_name, deadline,reminder, image,task_completed) VALUES (?,?,?,?,?,?)",
          [id, task, deadlineValue, reminderValue, imageValue, completedValue]
        );
        if (subTaskArray.length != 0) {
          //get the id of the latest task inserted first
          const { lastInsertRowId: task_id } = await db.runAsync("SELECT last_insert_rowid()");
          for (let sub of subTaskArray) {
            await db.runAsync(
              "INSERT INTO ProjectSubTasks (parent_task_id,subs,sub_completed) VALUES (?,?,?)",
              [task_id, sub, "no"]
            );
          }
        }
      });

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
    let userInput = value.trim();
    if (userInput.length == 0) {
      return;
    }
    setSubTaskArray((oldArray) => [...oldArray, value]);
  };

  //https://www.npmjs.com/package/@react-native-community/datetimepicker#usage

  const onChangeDate = (event, selectedDate) => {
    //means cancel was pressed
    if (event.type === "dismissed") {
      setShow(false);
      return;
    }
    const currentDate = selectedDate;

    setShow(false);
    setDate(currentDate);
    //convert to string date
    const value = currentDate.toLocaleString("en-GB").split(",", 1)[0];
    setDateFormater(value);
    if (event.type === "set") {
      setAutoTransitionDeadline(true);
    }
  };

  const onChangeTime = (event, selectedDate) => {
    //means cancel was pressed
    if (event.type === "dismissed") {
      setShow(false);
      setAutoTransitionDeadline(false);
      return;
    }
    const currentTime = selectedDate;
    setShow(false);
    setTime(currentTime);
    const value = currentTime.toTimeString().slice(0, 5);
    setTimeFormater(value);
    setAutoTransitionDeadline(false);
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
    //means cancel was pressed
    if (event.type === "dismissed") {
      setShowReminder(false);
      return;
    }
    const currentDate = selectedDate;
    setShowReminder(false);
    setDateReminder(currentDate);
    //convert to string date
    const value = currentDate.toLocaleString("en-GB").split(",", 1)[0];
    setReminderDateFormated(value);
    if (event.type === "set") {
      setAutoTransitionReminder(true);
    }
  };

  const onChangeTimeReminder = (event, selectedDate) => {
    //means cancel was pressed
    if (event.type === "dismissed") {
      setShowReminder(false);
      setAutoTransitionReminder(false);
      return;
    }
    const currentTime = selectedDate;
    setShowReminder(false);
    setTimeReminder(currentTime);
    const value = currentTime.toTimeString().slice(0, 5);
    setReminderTimeFormated(value);
    setAutoTransitionReminder(false);
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

  useEffect(() => {
    if (autoDeadline == true) {
      showTimepicker();
    }
  }, [autoDeadline]);

  useEffect(() => {
    if (autoReminder == true) {
      showTimepickerReminder();
    }
  }, [autoReminder]);

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
      case 3:
        setImagePreview(false);
        break;
    }
  };

  const deleteSubTask = (id) => {
    let copy = subTaskArray;
    let task = copy[id];
    copy = copy.filter((item) => !task.includes(item));
    setSubTaskArray(copy);
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
            ? taskCreationScreenStyles.mainContainerDark
            : taskCreationScreenStyles.mainContainerLight
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
        {/* main container, houses the 4 elements */}
        <View>
          <View style={taskCreationScreenStyles.deadlineMainContainer}>
            <DeadlineTouchable
              styles={taskCreationScreenStyles}
              currentTheme={currentTheme}
              showDatepicker={showDatepicker}
              toDisablePress={dateFormatted}
            />
            {dateFormatted != null ? (
              <View style={taskCreationScreenStyles.dateTimeView}>
                <Text style={{ fontSize: 16, color: currentTheme === "dark" ? "white" : "black" }}>
                  {dateFormatted}
                </Text>
                {timeFormatted != null ? (
                  <>
                    <Text
                      style={{
                        fontSize: 16,
                        paddingLeft: 10,
                        color: currentTheme === "dark" ? "white" : "black",
                      }}
                    >
                      {timeFormatted}
                    </Text>
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
                <CancelTouchable resetElement={resetElement} elementId={1} />
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
          <View style={taskCreationScreenStyles.subTasksMainContainer}>
            <SubTasksTouchable
              styles={taskCreationScreenStyles}
              currentTheme={currentTheme}
              setSubTasksModalVisible={setSubTasksModalVisible}
            />
            {subTaskArray.length != 0 ? (
              <ScrollView
                horizontal={true}
                style={taskCreationScreenStyles.subTaskScrollViewHorizontal}
              >
                <ScrollView style={taskCreationScreenStyles.subTaskScrollViewVertical}>
                  {subTaskArray.map((item, i) => {
                    return (
                      <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text
                          style={{
                            paddingTop: 5,
                            paddingLeft: 5,
                            fontSize: 18,
                            color: currentTheme === "dark" ? "white" : "black",
                          }}
                        >
                          {item}
                        </Text>
                        <TouchableOpacity
                          style={{ flexDirection: "row", marginLeft: 5 }}
                          onPress={() => deleteSubTask(i)}
                        >
                          <Text style={taskCreationScreenStyles.cancelEmoji}>❌</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              </ScrollView>
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
          <View style={taskCreationScreenStyles.imageMainContainer}>
            <CameraTouchable
              styles={taskCreationScreenStyles}
              currentTheme={currentTheme}
              navigation={navigation}
              id={id}
              isDisabled={imagePreview == true ? true : false}
            />
            {imagePreview != false ? (
              <View style={taskCreationScreenStyles.imagePreviewView}>
                <Image
                  source={{ uri: photoUri && photoUri.uri }}
                  style={taskCreationScreenStyles.imagePreview}
                />
                <CancelTouchable resetElement={resetElement} elementId={3} />
              </View>
            ) : null}
          </View>
          <View style={taskCreationScreenStyles.reminderMainContainer}>
            <ReminderTouchable
              styles={taskCreationScreenStyles}
              currentTheme={currentTheme}
              showDatepickerReminder={showDatepickerReminder}
              toDisablePress={dateReminderFormatted}
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
                  </>
                ) : (
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={showTimepickerReminder}
                  >
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
                <CancelTouchable resetElement={resetElement} elementId={2} />
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
