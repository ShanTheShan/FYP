import { React, useState, useEffect } from "react";
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

export default function ProjectTaskScreen({ navigation, route }) {
  //the project id we a creating a task for
  const { id } = route.params;

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
    <View style={styles.container}>
      <SafeAreaView>
        <TextInput
          style={{ height: 40, width: 150, borderWidth: 1, marginTop: 20 }}
          placeholder="Enter Task"
          onChangeText={(newText) => createTask(newText)}
          defaultValue={task}
        />
        <TouchableOpacity style={styles.submitButton} onPress={() => insertTaskQuery()}>
          <Text style={{ color: "white" }}> ENTER </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Camera", { pid: id })}>
          <Text style={{ fontSize: 30 }}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={() => console.log(id)}>
          <Text style={{ color: "white" }}> Check ID </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "blue",
    padding: 10,
    margin: 15,
    height: 40,
    width: 80,
  },
});
