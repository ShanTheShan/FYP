import { React } from "react";
import { Text, Image, TouchableOpacity } from "react-native";
import { taskCreationScreenStyles } from "../screens/styles/TaskCreationScreenStyles";

export const DeadlineTouchable = ({ styles, currentTheme, showDatepicker, toDisablePress }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: "row" }}
      onPress={showDatepicker}
      disabled={toDisablePress != null ? true : false}
    >
      <Image source={require("../assets/deadline.png")} style={styles.image} />
      <Text
        style={{
          fontSize: 20,
          paddingLeft: 10,
          color: currentTheme === "dark" ? "white" : "black",
        }}
      >
        Deadline
      </Text>
    </TouchableOpacity>
  );
};

export const SubTasksTouchable = ({ styles, currentTheme, setSubTasksModalVisible }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: "row" }}
      onPress={() => setSubTasksModalVisible(true)}
    >
      <Image source={require("../assets/subtasks.png")} style={styles.image} />
      <Text
        style={{
          fontSize: 20,
          paddingLeft: 10,
          color: currentTheme === "dark" ? "white" : "black",
        }}
      >
        Sub Tasks
      </Text>
    </TouchableOpacity>
  );
};

export const ReminderTouchable = ({
  styles,
  currentTheme,
  showDatepickerReminder,
  toDisablePress,
}) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: "row" }}
      onPress={showDatepickerReminder}
      disabled={toDisablePress != null ? true : false}
    >
      <Image source={require("../assets/bell.png")} style={styles.image} />
      <Text
        style={{
          fontSize: 20,
          paddingLeft: 10,
          color: currentTheme === "dark" ? "white" : "black",
        }}
      >
        Reminder
      </Text>
    </TouchableOpacity>
  );
};

export const CameraTouchable = ({ styles, currentTheme, navigation, id, isDisabled }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Camera", { id: id })}
      style={{ flexDirection: "row" }}
      disabled={isDisabled}
    >
      <Image source={require("../assets/camera.png")} style={styles.image} />
      <Text
        style={{
          fontSize: 20,
          paddingLeft: 10,
          color: currentTheme === "dark" ? "white" : "black",
        }}
      >
        Add Image
      </Text>
    </TouchableOpacity>
  );
};

export const CancelTouchable = ({ resetElement, elementId }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", marginLeft: 5 }}
      onPress={() => resetElement(elementId)}
    >
      <Text style={taskCreationScreenStyles.cancelEmoji}>❌</Text>
    </TouchableOpacity>
  );
};
