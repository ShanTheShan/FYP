import { React, useState, useEffect, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";

import { db } from "../constants/database";

import { themeContext } from "../context/themeContext";
import { AddButton } from "../components/customButtons";

export default function ProjectTaskScreen({ navigation, route }) {
  //the project id we a creating a task for
  const { id } = route.params;

  //global theme state
  const { currentTheme } = useContext(themeContext);

  //text input state
  const [task, createTask] = useState("");

  //SQLite query to insert task to project
  const insertTaskQuery = () => {
    try {
      db.runSync("INSERT INTO ProjectDetails (projectId, tasks) VALUES (?,?)", [id, task]);
      //empty the text input so we can type again
      createTask("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={currentTheme === "dark" ? styles.safeAreaDark : styles.safeAreaLight}>
      <View style={currentTheme === "dark" ? styles.containerDark : styles.containerLight}>
        <TextInput
          style={currentTheme === "dark" ? styles.textInputDark : styles.textInputLight}
          placeholder="Enter Task"
          onChangeText={(newText) => createTask(newText)}
          defaultValue={task}
        />
        <View style={currentTheme === "dark" ? styles.bulletsDark : styles.bulletsLight}>
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <Image source={require("../assets/deadline.png")} style={styles.image} />
            <Text style={currentTheme === "dark" ? styles.bulletTextDark : styles.bulletTextLight}>
              Deadline
            </Text>
          </TouchableOpacity>
        </View>
        <View style={currentTheme === "dark" ? styles.bulletsDark : styles.bulletsLight}>
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <Image source={require("../assets/deadline.png")} style={styles.image} />
            <Text style={currentTheme === "dark" ? styles.bulletTextDark : styles.bulletTextLight}>
              Sub Tasks
            </Text>
          </TouchableOpacity>
        </View>
        <View style={currentTheme === "dark" ? styles.bulletsDark : styles.bulletsLight}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Camera", { pid: id })}
            style={{ flexDirection: "row" }}
          >
            <Image source={require("../assets/camera.png")} style={styles.image} />
            <Text style={currentTheme === "dark" ? styles.bulletTextDark : styles.bulletTextLight}>
              Add Image
            </Text>
          </TouchableOpacity>
        </View>
        <View style={currentTheme === "dark" ? styles.bulletsDark : styles.bulletsLight}>
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <Image source={require("../assets/deadline.png")} style={styles.image} />
            <Text style={currentTheme === "dark" ? styles.bulletTextDark : styles.bulletTextLight}>
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

const styles = StyleSheet.create({
  safeAreaDark: {
    flex: 1,
    height: "100%",
    backgroundColor: "#1C1C1C",
  },
  safeAreaLight: {
    flex: 1,
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  image: {
    width: 30,
    height: 30,
  },
  containerDark: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: "5%",
    backgroundColor: "#1C1C1C",
  },
  containerLight: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: "5%",
    backgroundColor: "#FFFFFF",
  },

  textInputDark: {
    height: 50,
    width: "90%",
    borderWidth: 2,
    marginTop: 20,
    paddingLeft: 10,
    backgroundColor: "lightgrey",
  },
  textInputLight: {
    height: 40,
    width: "90%",
    borderWidth: 2,
    marginTop: 20,
    paddingLeft: 10,
  },
  bulletsDark: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  bulletsLight: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  bulletTextDark: {
    fontSize: 20,
    paddingLeft: 10,
    color: "white",
  },
  bulletTextLight: {
    fontSize: 20,
    paddingLeft: 10,
    color: "black",
  },
  submitButton: {
    backgroundColor: "green",
    padding: 10,
    margin: 15,
    height: 40,
    width: 80,
    borderRadius: 10,
    marginBottom: "30%",
  },
});
