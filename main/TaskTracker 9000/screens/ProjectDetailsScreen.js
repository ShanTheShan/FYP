import { React, useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View, SafeAreaView, TouchableOpacity } from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import * as Progress from "react-native-progress";
import { useIsFocused } from "@react-navigation/native";

import { db } from "../constants/database";

export default function ProjectDetails({ navigation, route }) {
  //TODO redo the the task deletion and progress bar increment
  const isFocused = useIsFocused();

  //inititae id that was passed from overview page
  const { id } = route.params;

  //array state to store project tasks
  const [projectDetails, uploadProjectDetails] = useState([]);

  const getAllTasks = () => {
    try {
      const allRows = db.getAllSync("SELECT * FROM ProjectDetails WHERE projectId = ?", [id]);
      uploadProjectDetails(allRows);
    } catch (error) {
      console.log(error);
    }
  };

  //when the page is in focus, this side effect happens
  useEffect(() => {
    if (isFocused) {
      getAllTasks();
    }
  }, [isFocused]);

  // //hook to change the val of progress bar
  const [progressValue, setProgressValue] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.projecTabProgress}>
        <Progress.Bar progress={progressValue} width={200} height={20} color={"green"} />
        <Text style={{ fontSize: 30 }}>{Math.floor(progressValue * 100)}%</Text>
      </View>
      <TableView>
        <Section>
          {projectDetails.map((item) => (
            <Cell key={item.id} title={item.tasks} />
          ))}
        </Section>
      </TableView>
      <View style={styles.projecTabTasks}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.navigate("Project_Task", { id: id })}
        >
          <Text style={{ color: "white" }}> Add Task </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  projecTabProgress: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "red",
  },
  projecTabTasks: {
    flex: 4,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  addTaskBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "blue",
  },
  submitButton: {
    backgroundColor: "red",
    padding: 10,
    margin: 15,
    height: 40,
    width: 100,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 40,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
