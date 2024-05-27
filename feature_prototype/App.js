import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Button,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { useFocusEffect } from "@react-navigation/native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import * as Progress from "react-native-progress";
import { CameraView, useCameraPermissions } from "expo-camera";

import TimerScreen from "./timer";
import RenderCamera from "./camera";

//custom cell for project board page
const HomescreenCell = (props) => (
  <Cell
    onPress={props.action}
    {...props}
    cellContentView={
      <View>
        <Text style={{ fontSize: 20 }}>{props.title}</Text>
      </View>
    }
  />
);

//custom cell for project tabs
const ProjectCell = (props) => (
  <Cell
    onPress={props.action}
    {...props}
    cellContentView={
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 20 }}>{props.title}</Text>
      </View>
    }
  />
);

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView>
      <TableView>
        <Section>
          <HomescreenCell action={() => navigation.navigate("Project_Details")} title="Project 1" />
          <HomescreenCell action={() => navigation.navigate("Project_Details")} title="Project 2" />
        </Section>
      </TableView>
    </SafeAreaView>
  );
}

function ProjectScreen({ route, navigation }) {
  //hook to change the val of progress bar
  const [progressValue, setProgressValue] = useState(0);
  //hook to get total task count, this just increments when tasks are added to array
  const [tasksLeft, setTasksLeft] = useState(0);
  const [numberofTask, setTaskCount] = useState(0);

  //hook to update the tasklist array
  const [taskList, setTasks] = useState([]);
  const [task, createTask] = useState("");

  //hook to update image notes array

  const addItemToArray = () => {
    if (task.trim() === "") {
      return; // Do not add empty tasks
    }
    setTasks([
      ...taskList,
      {
        id: taskList.length,
        name: task,
      },
    ]);
    // Clear the input field after adding a task
    createTask("");

    //update total number task everytime new task added
    setTaskCount(numberofTask + 1);
    setTasksLeft(numberofTask + 1);
  };

  //to delete the task when its pressed
  const deleteItemInArray = (id) => {
    setTasksLeft(numberofTask - 1);

    setTasks([...taskList.filter((item) => item.id !== id)]);
    //update progress bar based on the number of task left

    let increment = 1 / numberofTask;
    setProgressValue(progressValue + increment);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.projecTabProgress}>
        <Progress.Bar progress={progressValue} width={200} height={20} color={"green"} />
        <Text style={{ fontSize: 30 }}>{Math.floor(progressValue * 100)}%</Text>
      </View>
      <TableView>
        <Section>
          {/* tasks text */}
          {taskList.map((item, i) => {
            return (
              <Cell
                key={item.id}
                title={item.name}
                onPress={() => deleteItemInArray(item.id)}
              ></Cell>
            );
          })}
        </Section>
      </TableView>
      <View style={styles.projecTabTasks}>
        <TextInput
          style={{ height: 40, width: 150, borderWidth: 1, marginTop: 20 }}
          placeholder="Enter Task"
          onChangeText={(newText) => createTask(newText)}
          defaultValue={task}
        />
        {/* sends the user input to function addItemToArray onPress*/}
        <TouchableOpacity style={styles.submitButton} onPress={() => addItemToArray()}>
          <Text style={{ color: "white" }}> ENTER </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
          <Text style={{ fontSize: 30 }}>📷</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// navigation stack object
const ProjectStack = createStackNavigator();

//a stack for each bottom navigation
function ProjectStackScreen() {
  return (
    <ProjectStack.Navigator>
      <ProjectStack.Screen name="Projects Overview" component={HomeScreen} />
      <ProjectStack.Screen name="Project_Details" component={ProjectScreen} />
      //TODO pass image from camera page to project page to load
      <ProjectStack.Screen
        name="Camera"
        component={RenderCamera}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity
              title="Back"
              onPress={() => navigation.navigate("Project_Details", { item: imageURI })}
            >
              <Text>⬅️</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </ProjectStack.Navigator>
  );
}

const TimerStack = createStackNavigator();

function TimerStackScreen() {
  return (
    <TimerStack.Navigator>
      <TimerStack.Screen name="TimerScreen" component={TimerScreen} />
    </TimerStack.Navigator>
  );
}

//bottom navigation object
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Project" component={ProjectStackScreen} />
        <Tab.Screen name="Timer" component={TimerStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
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
    backgroundColor: "blue",
    padding: 10,
    margin: 15,
    height: 40,
    width: 80,
  },
});
