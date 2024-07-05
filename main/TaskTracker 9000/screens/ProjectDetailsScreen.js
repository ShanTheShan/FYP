import { React, useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import * as Progress from "react-native-progress";
import { useIsFocused } from "@react-navigation/native";

import { db } from "../constants/database";

import { themeContext } from "../context/themeContext";
import { AddButton, DeleteButton } from "../components/customButtons";

//custom cell for project details cell
const DetailsCell = (props) => {
  //delimit subtask using our custom delimiter
  const reformedSubTaskData = props.subtasks.split("@#");
  const deadlineSplitted = props.deadline.split("|");
  let reformedDeadlineData = null;

  if (deadlineSplitted[1] == " null") {
    reformedDeadlineData = deadlineSplitted[0];
  } else {
    reformedDeadlineData = deadlineSplitted;
  }

  return (
    <Cell
      key={props.key}
      onPress={props.action}
      backgroundColor={props.theme}
      titleTextColor={props.textColor}
      {...props}
      cellContentView={
        <View>
          <Text style={[{ fontSize: 20, paddingBottom: 5 }, { color: props.textColor }]}>
            {props.tasks}
          </Text>
          {props.deadline != "null | null" ? (
            <Text style={[{ fontSize: 15, paddingLeft: 10 }, { color: props.textColor }]}>
              {reformedDeadlineData}
            </Text>
          ) : null}

          <View>
            {reformedSubTaskData.map((item, i) => (
              <Text key={i} style={[{ fontSize: 15, paddingLeft: 10 }, { color: props.textColor }]}>
                {item}
              </Text>
            ))}
          </View>
        </View>
      }
    />
  );
};

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
      const projectNameAndProgress = await db.getFirstAsync(
        "SELECT projectName, progress FROM Projects WHERE id = ?",
        [id]
      );

      setProjectDetails(allRows);
      setProjectName(projectNameAndProgress.projectName);
      setProgressValue(projectNameAndProgress.progress);

      const lengthOfProject = allRows.length;
      setTaskCount(lengthOfProject);
    } catch (error) {
      console.log("getAllTasks() error: ", error);
    }
  };

  //when the page is in focus, this side effect happens
  useEffect(() => {
    if (isFocused) {
      getAllTasks();
    }
  }, [isFocused]);

  const handleTaskTouch = (task) => {
    console.log(task);
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

  const updateProgressBar = async () => {
    //upon deletion, update tasks left and counter
    const currentTasks = numberOfTasks - counter;
    setCounter(counter + 1);

    //upon deletion, update progress bar
    const calculatePercent = 1 - currentTasks / numberOfTasks;
    console.log(calculatePercent);
    setProgressValue(calculatePercent);

    try {
      await db.runAsync("UPDATE Projects SET progress = ? WHERE id = ?", [calculatePercent, id]);
    } catch (error) {
      console.log("updateProgressBar() error: ", error);
    }
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
              <DetailsCell
                key={item.id}
                tasks={item.tasks}
                deadline={item.deadline}
                subtasks={item.subtasks}
                textColor={currentTheme === "dark" ? "#FFFFFF" : "#000000"}
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
