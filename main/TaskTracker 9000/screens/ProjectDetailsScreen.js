import { React, useState, useEffect, useContext } from "react";
import { Image, Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import { Cell, Section } from "react-native-tableview-simple";
import * as Progress from "react-native-progress";
import { useIsFocused } from "@react-navigation/native";

import { db } from "../constants/database";

import { themeContext } from "../context/themeContext";
import { projectDetailStyles, Circle } from "./styles/ProjectDetailStyles";
import { AddButton } from "../components/customButtons";
import { AccordionItem, Item, Parent, AccordionTouchable } from "../components/customAccordion";

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

  const taskImage = props.customImage;

  return (
    <Cell
      key={props.key}
      onPress={props.action}
      isDisabled={true}
      backgroundColor={props.theme}
      titleTextColor={props.textColor}
      {...props}
      cellContentView={
        <View style={{ paddingLeft: 5, paddingVertical: 5 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {props.completed ? null : (
              <TouchableOpacity onPress={props.customPress}>
                <Circle />
              </TouchableOpacity>
            )}

            <Text
              style={[
                { fontSize: 20, paddingBottom: 5, paddingLeft: 10 },
                { color: props.textColor },
              ]}
            >
              {props.tasks}
            </Text>
          </View>

          <View style={{ paddingLeft: 25 }}>
            {props.deadline != "null | null" ? (
              <Text style={[{ fontSize: 15, paddingLeft: 10 }, { color: props.textColor }]}>
                {reformedDeadlineData}
              </Text>
            ) : null}
            {reformedSubTaskData[0] != "" ? (
              <View>
                {reformedSubTaskData.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      console.log("sub task presssed");
                    }}
                  >
                    <Text
                      key={i}
                      style={[{ fontSize: 15, paddingLeft: 10 }, { color: props.textColor }]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            {taskImage ? (
              <View>
                <Image source={{ uri: taskImage }} style={projectDetailStyles.image} />
              </View>
            ) : null}
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

  const [projectName, setProjectName] = useState([]);
  //array state to store project tasks
  const [projectDetails, setProjectDetails] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [comments, setProjectComments] = useState([]);

  //for progress bar logic
  const [progressValue, setProgressValue] = useState(0);
  const [counter, setCounter] = useState(1);
  const [numberOfTasks, setTaskCount] = useState(0);

  //for reanimated accordion
  const [firstAccordionOpen, setFirstAccordionOpen] = useState(false);
  const [secondAccordionOpen, setSecondAccordionOpen] = useState(false);
  const [thirdAccordionOpen, setThirdAccordionOpen] = useState(false);

  const getAllTasks = async () => {
    try {
      const allUncompletedRows = await db.getAllAsync(
        "SELECT * FROM ProjectDetails WHERE projectId = ? AND completed = ?",
        [id, "no"]
      );
      const allCompletedRows = await db.getAllAsync(
        "SELECT * FROM ProjectDetails WHERE projectId = ? AND completed = ?",
        [id, "yes"]
      );
      const projectNameAndProgress = await db.getFirstAsync(
        "SELECT projectName, progress FROM Projects WHERE id = ?",
        [id]
      );

      setProjectDetails(allUncompletedRows);
      setProjectName(projectNameAndProgress.projectName);
      setProgressValue(projectNameAndProgress.progress);

      setCompletedTasks(allCompletedRows);

      const lengthOfProject = allUncompletedRows.length;
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

  const handleTaskTouch = (item) => {
    try {
      setCompletedTasks((oldArray) => [...oldArray, item]);
      deleteTask(item.tasks);
      updateProgressBar();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (task) => {
    try {
      //await db.runAsync("DELETE FROM ProjectDetails WHERE projectId = ? AND tasks = ?", [id, task]);
      await db.runAsync(
        "UPDATE ProjectDetails SET completed = ? WHERE projectId = ? AND tasks = ?",
        ["yes", id, task]
      );
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
    setProgressValue(calculatePercent);

    try {
      await db.runAsync("UPDATE Projects SET progress = ? WHERE id = ?", [calculatePercent, id]);
    } catch (error) {
      console.log("updateProgressBar() error: ", error);
    }
  };

  return (
    <SafeAreaView
      style={[
        projectDetailStyles.container,
        currentTheme === "dark" ? { backgroundColor: "#1C1C1C" } : { backgroundColor: "#FFFFFF" },
      ]}
    >
      <View
        style={
          currentTheme === "dark"
            ? projectDetailStyles.projecTabProgressDark
            : projectDetailStyles.projecTabProgressLight
        }
      >
        <Text
          style={
            currentTheme === "dark"
              ? projectDetailStyles.projectNameDark
              : projectDetailStyles.projecNameLight
          }
        >
          {projectName}
        </Text>
        <Progress.Bar progress={progressValue} width={200} height={20} color={"green"} />
        <Text
          style={
            currentTheme === "dark"
              ? projectDetailStyles.progressPercentDark
              : projectDetailStyles.progressPercentLight
          }
        >
          {Math.floor(progressValue * 100)}%
        </Text>
      </View>
      <View style={projectDetailStyles.completedTaskView}>
        <AccordionTouchable
          onPress={() => setFirstAccordionOpen(!firstAccordionOpen)}
          text="Uncompleted"
          currentTheme={"dark"}
        />
      </View>
      <View>
        <Parent
          isOpen={firstAccordionOpen}
          uniqueKey={"first"}
          AccordionComponent={AccordionItem}
          ItemComponent={() => (
            <Item
              scrollHeight={350}
              currentTheme={currentTheme}
              content={
                <Section>
                  {projectDetails.map((item) => (
                    <DetailsCell
                      key={item.id}
                      tasks={item.tasks}
                      deadline={item.deadline}
                      subtasks={item.subtasks}
                      customImage={item.image}
                      textColor={currentTheme === "dark" ? "#FFFFFF" : "#000000"}
                      backgroundColor={currentTheme === "dark" ? "#141414" : "#F6F6F6"}
                      completed={false}
                      customPress={() => {
                        handleTaskTouch(item);
                      }}
                      // onPress={() => {
                      //   handleTaskTouch(item);
                      // }}
                    />
                  ))}
                </Section>
              }
            />
          )}
        />
      </View>
      <View style={projectDetailStyles.completedTaskView}>
        <AccordionTouchable
          onPress={() => setSecondAccordionOpen(!secondAccordionOpen)}
          text="Completed"
          currentTheme={"dark"}
        />
      </View>
      <View>
        <Parent
          isOpen={secondAccordionOpen}
          uniqueKey={"second"}
          AccordionComponent={AccordionItem}
          ItemComponent={() => (
            <Item
              scrollHeight={200}
              currentTheme={currentTheme}
              content={
                <Section>
                  {completedTasks.map((item) => (
                    <DetailsCell
                      key={item.id}
                      tasks={item.tasks}
                      deadline={item.deadline}
                      subtasks={item.subtasks}
                      customImage={item.image}
                      textColor={currentTheme === "dark" ? "#FFFFFF" : "#000000"}
                      backgroundColor={currentTheme === "dark" ? "#141414" : "#F6F6F6"}
                      completed={true}
                    />
                  ))}
                </Section>
              }
            />
          )}
        />
      </View>
      <View style={projectDetailStyles.completedTaskView}>
        <AccordionTouchable
          onPress={() => setThirdAccordionOpen(!thirdAccordionOpen)}
          text="Comments"
          currentTheme={"dark"}
        />
      </View>
      <View>
        <Parent
          isOpen={thirdAccordionOpen}
          uniqueKey={"third"}
          AccordionComponent={AccordionItem}
          ItemComponent={() => (
            <Item
              scrollHeight={200}
              currentTheme={currentTheme}
              content={
                <Section>
                  {comments.map((item) => (
                    <DetailsCell
                      key={item.id}
                      tasks={item.tasks}
                      deadline={item.deadline}
                      subtasks={item.subtasks}
                      customImage={item.image}
                      textColor={currentTheme === "dark" ? "#FFFFFF" : "#000000"}
                      backgroundColor={currentTheme === "dark" ? "#141414" : "#F6F6F6"}
                    />
                  ))}
                </Section>
              }
            />
          )}
        />
      </View>
      <AddButton
        press={() => {
          navigation.navigate("Create Task", { id: id });
        }}
      />
    </SafeAreaView>
  );
}
