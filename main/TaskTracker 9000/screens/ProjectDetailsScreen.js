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
  const reformedSubTaskData = props.subtasks;
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
            {reformedSubTaskData.length != 0 ? (
              <View>
                {reformedSubTaskData.map((item, i) => (
                  <TouchableOpacity key={i} onPress={() => props.handleSubTouch(item)}>
                    <Text
                      key={i}
                      style={
                        item.sub_completed === "yes"
                          ? [
                              {
                                fontSize: 15,
                                paddingLeft: 10,
                                lineHeight: 20,
                                textDecorationLine: "line-through",
                                color: props.textColor,
                              },
                            ]
                          : { fontSize: 15, paddingLeft: 10, color: props.textColor }
                      }
                      // style={[
                      //   { fontSize: 15, paddingLeft: 10, textDecorationLine: "line-through" },
                      //   { color: props.textColor },
                      // ]}
                    >
                      {item.subs}
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

  //this function is to take the results from the SQL queries,
  //and reshape them into a singular object of arrays,
  //that each contain their respective sub tasks
  const reformat = (result) => {
    return result.reduce((acc, item) => {
      // Check if the task already exists in the accumulator
      let task = acc.find((t) => t.task_id === item.task_id);

      // If the task doesn't exist, create a new task object
      if (!task) {
        task = {
          project_id: item.project_id,
          task_id: item.task_id,
          task_name: item.task_name,
          deadline: item.deadline,
          reminder: item.reminder,
          image: item.image,
          task_completed: item.task_completed,
          sub_tasks: [],
        };
        acc.push(task);
      }

      // Add the subtask to the task's sub_tasks array if it exists
      if (item.sub_task_id) {
        task.sub_tasks.push({
          sub_task_id: item.sub_task_id,
          parent_task_id: item.parent_task_id,
          subs: item.subs,
          sub_completed: item.sub_completed,
        });
      }

      acc.forEach((item) => {
        item.sub_tasks.sort((a, b) => a.sub_task_id - b.sub_task_id);
      });

      return acc;
    }, []);
  };

  const getAllTasks = async () => {
    try {
      let allUncompletedRows = await db.getAllAsync(
        `
        SELECT * FROM ProjectDetails LEFT JOIN ProjectSubTasks 
        ON ProjectDetails.task_id = ProjectSubTasks.parent_task_id 
        WHERE ProjectDetails.project_id = ? AND ProjectDetails.task_completed = ? 
        ORDER BY ProjectDetails.task_id ASC
        `,
        [id, "no"]
      );
      allUncompletedRows = reformat(allUncompletedRows);

      let allCompletedRows = await db.getAllAsync(
        `
        SELECT * FROM ProjectDetails LEFT JOIN ProjectSubTasks 
        ON ProjectDetails.task_id = ProjectSubTasks.parent_task_id 
        WHERE ProjectDetails.project_id = ? AND ProjectDetails.task_completed = ? 
        ORDER BY ProjectDetails.task_id ASC
        `,
        [id, "yes"]
      );
      allCompletedRows = reformat(allCompletedRows);

      const projectNameAndProgress = await db.getFirstAsync(
        "SELECT projectName, progress FROM Projects WHERE id = ?",
        [id]
      );

      setProjectDetails(allUncompletedRows);
      setCompletedTasks(allCompletedRows);

      setProjectName(projectNameAndProgress.projectName);
      setProgressValue(projectNameAndProgress.progress);

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
      deleteTask(item.task_name);
      updateProgressBar();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubTouch = async (item) => {
    try {
      await db.runAsync(
        "UPDATE ProjectSubTasks SET sub_completed = ? WHERE subs = ? AND parent_task_id=?",
        ["yes", item.subs, item.parent_task_id]
      );
      getAllTasks();
    } catch (error) {
      console.log("handleSubTouch() error:", error);
    }
  };

  const deleteTask = async (task) => {
    try {
      //await db.runAsync("DELETE FROM ProjectDetails WHERE projectId = ? AND tasks = ?", [id, task]);
      await db.runAsync(
        "UPDATE ProjectDetails SET task_completed = ? WHERE project_id = ? AND task_name = ?",
        ["yes", id, task]
      );
      //update state
      let stateCopy = projectDetails.filter((obj) => obj.task_name !== task);
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

  const dummyFn = async () => {
    try {
      const result = await db.getAllAsync(
        `
        SELECT * FROM ProjectDetails LEFT JOIN ProjectSubTasks 
        ON ProjectDetails.task_id = ProjectSubTasks.parent_task_id 
        WHERE ProjectDetails.project_id = ? AND ProjectDetails.task_completed = "no" 
        ORDER BY ProjectDetails.task_id ASC
        `,
        [id]
      );
      const data = result.reduce((acc, item) => {
        // Check if the task already exists in the accumulator
        let task = acc.find((t) => t.task_id === item.task_id);

        // If the task doesn't exist, create a new task object
        if (!task) {
          task = {
            project_id: item.project_id,
            task_id: item.task_id,
            task_name: item.task_name,
            deadline: item.deadline,
            reminder: item.reminder,
            image: item.image,
            task_completed: item.task_completed,
            sub_tasks: [],
          };
          acc.push(task);
        }

        // Add the subtask to the task's sub_tasks array if it exists
        if (item.sub_task_id) {
          task.sub_tasks.push({
            sub_task_id: item.sub_task_id,
            parent_task_id: item.parent_task_id,
            subs: item.subs,
            sub_completed: item.sub_completed,
          });
        }

        return acc;
      }, []);
      console.log("Project Details: ", data);
    } catch (error) {
      console.log("dummyFn() error:", error);
    }
  };

  const fetchTasksOnly = async () => {
    try {
      const result = await db.getAllAsync("SELECT * FROM ProjectDetails WHERE project_id =?", [id]);
      console.log("tasks only:", result);
    } catch (error) {
      console.log("fetchTasksOnly() error:", error);
    }
  };

  const fetchSubsOnly = async () => {
    try {
      const result = await db.getAllAsync("SELECT * FROM ProjectSubTasks");
      console.log("subs only:", result);
    } catch (error) {
      console.log("fetchSubsOnly() error:", error);
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
                      key={item.task_id}
                      tasks={item.task_name}
                      subtasks={item.sub_tasks}
                      deadline={item.deadline}
                      customImage={item.image}
                      textColor={currentTheme === "dark" ? "#FFFFFF" : "#000000"}
                      backgroundColor={currentTheme === "dark" ? "#141414" : "#F6F6F6"}
                      completed={false}
                      handleSubTouch={handleSubTouch}
                      customPress={() => {
                        handleTaskTouch(item);
                      }}
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
                      key={item.task_id}
                      tasks={item.task_name}
                      subtasks={item.sub_tasks}
                      deadline={item.deadline}
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
