import { React, useState, useEffect, useContext } from "react";
import { Text, View, Image, TextInput, SafeAreaView, TouchableOpacity, Modal } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { db } from "../constants/database";

import { themeContext } from "../context/themeContext";
import { AddButton } from "../components/customButtons";
import { taskCreationScreenStyles } from "./styles/TaskCreationScreenStyles";

export default function NoteCreationScreen({ navigation, route }) {
  //not sure if push notifications should go here, but i put here first
  //const { expoPushToken, notification } = usePushNotifications();

  //if screen is focused
  const isFocused = useIsFocused();

  const { photoUri } = route.params;

  //global theme state
  const { currentTheme } = useContext(themeContext);

  //text input state
  const [note, createNote] = useState("");

  //image state
  const [imagePreview, setImagePreview] = useState(false);

  useEffect(() => {
    if ((photoUri != null || photoUri != undefined) && isFocused == true) setImagePreview(true);
  }, [isFocused]);

  //SQLite query to insert note
  const insertNoteQuery = () => {
    let imageValue = null;

    //if we have an image, store it
    if (photoUri != null || undefined) imageValue = photoUri.uri;

    try {
      db.runSync("INSERT INTO Notes (note,image) VALUES (?,?)", [note, imageValue]);
      //empty the text input so we can type again
      createNote("");
      //empty datetime, subtask, images and reminder, for new input
      setImagePreview(false);
    } catch (error) {
      console.log(error);
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
          placeholder="Enter Note"
          onChangeText={(newText) => createNote(newText)}
          defaultValue={note}
        />
        <View
          style={
            currentTheme === "dark"
              ? taskCreationScreenStyles.bulletsDark
              : taskCreationScreenStyles.bulletsLight
          }
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Camera Note", { id: "empty" })}
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
          {imagePreview != false ? (
            <View style={taskCreationScreenStyles.imagePreviewView}>
              <Image
                source={{ uri: photoUri && photoUri.uri }}
                style={taskCreationScreenStyles.imagePreview}
              />
            </View>
          ) : null}
        </View>
      </View>
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <AddButton press={() => insertNoteQuery()} />
      </View>
    </SafeAreaView>
  );
}
