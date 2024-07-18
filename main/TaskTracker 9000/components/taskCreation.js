import { React } from "react";
import { Text, Image, TouchableOpacity } from "react-native";

export const DeadlineTouchable = ({ styles, currentTheme, showDatepicker }) => {
  return (
    <TouchableOpacity style={{ flexDirection: "row" }} onPress={showDatepicker}>
      <Image source={require("../assets/deadline.png")} style={styles.image} />
      <Text style={currentTheme === "dark" ? styles.bulletTextDark : styles.bulletTextLight}>
        Deadline
      </Text>
    </TouchableOpacity>
  );
};

export const ReminderTouchable = ({ styles, currentTheme, showDatepickerReminder }) => {
  return (
    <TouchableOpacity style={{ flexDirection: "row" }} onPress={showDatepickerReminder}>
      <Image source={require("../assets/bell.png")} style={styles.image} />
      <Text style={currentTheme === "dark" ? styles.bulletTextDark : styles.bulletTextLight}>
        Reminder
      </Text>
    </TouchableOpacity>
  );
};

export const CameraTouchable = ({ styles, currentTheme, navigation, id }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Camera", { id: id })}
      style={{ flexDirection: "row" }}
    >
      <Image source={require("../assets/camera.png")} style={styles.image} />
      <Text style={currentTheme === "dark" ? styles.bulletTextDark : styles.bulletTextLight}>
        Add Image
      </Text>
    </TouchableOpacity>
  );
};
