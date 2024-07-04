import { React, useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import * as Progress from "react-native-progress";
import { useIsFocused } from "@react-navigation/native";

import { db } from "../constants/database";

import { themeContext } from "../context/themeContext";
import { AddButton, DeleteButton } from "../components/customButtons";

export default function ProjectDetails({ navigation, route }) {
  //global theme state
  const { currentTheme } = useContext(themeContext);

  const isFocused = useIsFocused();

  //inititae id that was passed from overview page
  const { id } = route.params;

  //array state to store project tasks
  const [projectDetails, setProjectDetails] = useState([]);
  //array state to store project tasks
  const [projectName, setProjectName] = useState([]);
  //for progress bar logic
  const [progressValue, setProgressValue] = useState(0);
  const [counter, setCounter] = useState(1);
  const [numberOfTasks, setTaskCount] = useState(0);

  const getAllTasks = async () => {
    try {
      const allRows = await db.getAllAsync("SELECT * FROM ProjectDetails WHERE projectId = ?", [
        id,
      ]);
      const projName = await db.getFirstAsync("SELECT projectName FROM Projects WHERE id = ?", [
        id,
      ]);

      setProjectDetails(allRows);
      setProjectName(projName.projectName);

      let lengthOfProject = allRows.length;
      setTaskCount(lengthOfProject);
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

  const handleTaskTouch = (task) => {
    try {
      deleteTask(task);
      updateProgressBar();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (task) => {
    try {
      await db.runAsync("DELETE FROM ProjectDetails WHERE projectId = ? AND tasks = ?", [id, task]);

      //update state
      let stateCopy = projectDetails.filter((obj) => obj.tasks !== task);
      setProjectDetails(stateCopy);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProgressBar = () => {
    //upon deletion, update tasks left and counter
    let currentTasks = numberOfTasks - counter;
    setCounter(counter + 1);

    //upon deletion, update progress bar
    let calculatePercent = 1 - currentTasks / numberOfTasks;
    setProgressValue(calculatePercent);
  };

  const deleteProject = async (id, navigation) => {
    try {
      await db.runAsync("DELETE FROM Projects WHERE id = ?", [id]);
      navigation.navigate("Projects Overview");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={
          currentTheme === "dark" ? styles.projecTabProgressDark : styles.projecTabProgressLight
        }
      >
        <Text style={currentTheme === "dark" ? styles.projectNameDark : styles.projecNameLight}>
          {projectName}
        </Text>
        <Progress.Bar progress={progressValue} width={200} height={20} color={"green"} />
        <Text
          style={currentTheme === "dark" ? styles.progressPercentDark : styles.progressPercentLight}
        >
          {Math.floor(progressValue * 100)}%
        </Text>
      </View>
      <ScrollView style={currentTheme === "dark" ? styles.scrollViewDark : styles.scrollViewLight}>
        <TableView>
          <Section>
            {projectDetails.map((item) => (
              <Cell
                key={item.id}
                title={item.tasks}
                titleTextColor={currentTheme === "dark" ? "#FFFFFF" : "#000000"}
                backgroundColor={currentTheme === "dark" ? "#141414" : "#F6F6F6"}
                onPress={() => {
                  handleTaskTouch(item.tasks);
                }}
              />
            ))}
          </Section>
        </TableView>
      </ScrollView>
      <AddButton
        press={() => {
          navigation.navigate("Create Task", { id: id });
        }}
      />
      <DeleteButton
        press={() => {
          deleteProject(id, navigation);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  projecTabProgressDark: {
    backgroundColor: "#1C1C1C",
    alignItems: "center",
    justifyContent: "center",
  },
  projecTabProgressLight: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  projecNameLight: {
    fontSize: 20,
    paddingBottom: 10,
    color: "black",
  },
  projectNameDark: {
    fontSize: 20,
    paddingVertical: 10,

    color: "white",
  },
  progressPercentDark: {
    fontSize: 22,
    color: "white",
    paddingTop: 5,
  },
  progressPercentLight: {
    color: "black",
  },

  scrollViewLight: {
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  scrollViewDark: {
    height: "100%",
    backgroundColor: "#1C1C1C",
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
});
