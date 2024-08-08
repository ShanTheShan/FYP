import { React, useState, useEffect, useContext } from "react";
import { Text, View, TextInput, SafeAreaView, TouchableOpacity, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { createNotification } from "../constants/push";
import { db } from "../constants/database";

import { themeContext } from "../context/themeContext";
import { animationContext } from "../context/animationContext";
import { AddButton } from "../components/customButtons";
import { TextValidator, ActionDone } from "../components/customTextValidator";
import { todoCreationScreenStyles } from "./styles/TodoCreationScreenStyles";
import { ReminderTouchable, CancelTouchable } from "../components/taskCreation";

export default function TodoCreationScreen({ navigation, route }) {
  //get the date selected by user
  const { dateSelected } = route.params;

  //global theme state
  const { currentTheme } = useContext(themeContext);

  //global animation state
  const { setToggleValidator } = useContext(animationContext);
  const { setToggleActionDone } = useContext(animationContext);

  //text input state
  const [input, setInput] = useState("");

  //date time states for reminder
  const [dateReminder, setDateReminder] = useState(new Date());
  const [dateReminderFormatted, setReminderDateFormated] = useState(null);

  const [timeReminder, setTimeReminder] = useState(new Date());
  const [timeReminderFormatted, setReminderTimeFormated] = useState(null);

  const [modeReminder, setModeReminder] = useState("date");
  const [showReminder, setShowReminder] = useState(false);

  const insertTodoQuery = async (value) => {
    let reminderValue = dateReminderFormatted;
    //check if text input empty
    if (!input) {
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

    //if we have a reminder, create a reminder schedule notification
    if (dateReminderFormatted != null && timeReminderFormatted != null) {
      createNotification(dateReminderFormatted, timeReminderFormatted, input);
    }

    try {
      await db.runAsync("INSERT INTO Todos (date,todo,done,reminder) VALUES (?,?,?,?)", [
        dateSelected,
        value,
        "no",
        reminderValue,
      ]);
      setInput("");
      setReminderDateFormated(null);
      setReminderTimeFormated(null);

      //toggle the added animation
      setToggleActionDone(true);
      setTimeout(() => {
        setToggleActionDone(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
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
      showTimepickerReminder();
    }
  };

  const onChangeTimeReminder = (event, selectedDate) => {
    //means cancel was pressed
    if (event.type === "dismissed") {
      setShowReminder(false);
      return;
    }
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

  const resetElement = () => {
    setReminderDateFormated(null);
    setReminderTimeFormated(null);
  };

  return (
    <SafeAreaView
      style={
        currentTheme === "dark"
          ? todoCreationScreenStyles.safeAreaDark
          : todoCreationScreenStyles.safeAreaLight
      }
    >
      <View
        style={
          currentTheme === "dark"
            ? todoCreationScreenStyles.mainContainerDark
            : todoCreationScreenStyles.mainContainerLight
        }
      >
        <TextInput
          style={
            currentTheme === "dark"
              ? todoCreationScreenStyles.textInputDark
              : todoCreationScreenStyles.textInputLight
          }
          placeholder="Enter Note"
          onChangeText={(newText) => setInput(newText)}
          defaultValue={input}
        />
        <View style={todoCreationScreenStyles.reminderMainContainer}>
          <ReminderTouchable
            styles={todoCreationScreenStyles}
            currentTheme={currentTheme}
            showDatepickerReminder={showDatepickerReminder}
            toDisablePress={dateReminderFormatted}
          />
          {dateReminderFormatted != null ? (
            <View style={todoCreationScreenStyles.dateTimeView}>
              <Text
                style={
                  currentTheme === "dark"
                    ? todoCreationScreenStyles.dateDark
                    : todoCreationScreenStyles.dateLight
                }
              >
                {dateReminderFormatted}
              </Text>
              {timeReminderFormatted != null ? (
                <>
                  <Text
                    style={
                      currentTheme === "dark"
                        ? todoCreationScreenStyles.timeDark
                        : todoCreationScreenStyles.timeLight
                    }
                  >
                    {timeReminderFormatted}
                  </Text>
                </>
              ) : (
                <TouchableOpacity style={{ flexDirection: "row" }} onPress={showTimepickerReminder}>
                  <Text
                    style={
                      currentTheme === "dark"
                        ? todoCreationScreenStyles.timeTouchableDark
                        : todoCreationScreenStyles.timeTouchableLight
                    }
                  >
                    TIME
                  </Text>
                </TouchableOpacity>
              )}
              <CancelTouchable resetElement={resetElement} />
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
        <TextValidator value="Todo" currentTheme={currentTheme} />
        <TextValidator value="Set a time for your reminder!" currentTheme={currentTheme} />
        <ActionDone value="Todo" currentTheme={currentTheme} />
        <AddButton press={() => insertTodoQuery(input)} />
      </View>
    </SafeAreaView>
  );
}
