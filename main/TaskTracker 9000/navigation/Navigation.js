import { React } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import TimerScreen from "../screens/TimerScreen";
import RenderCamera from "../screens/CameraScreen";
import ProjectDetails from "../screens/ProjectDetailsScreen";
import TodoScreen from "../screens/TodoScreen";
import ProjectTaskScreen from "../screens/TaskCreationScreen";

// navigation stack object
const ProjectStack = createStackNavigator();

//a stack for each bottom navigation
function ProjectStackScreen() {
  return (
    <ProjectStack.Navigator>
      <ProjectStack.Screen name="Projects Overview" component={HomeScreen} />
      <ProjectStack.Screen name="Project_Details" component={ProjectDetails} />
      <ProjectStack.Screen
        name="Camera"
        component={RenderCamera}
        options={{ headerShown: false }}
      />
      <ProjectStack.Screen name="Project_Task" component={ProjectTaskScreen} />
    </ProjectStack.Navigator>
  );
}

const TimerStack = createStackNavigator();

function TimerStackScreen() {
  return (
    <TimerStack.Navigator>
      <TimerStack.Screen name="Focus Tool" component={TimerScreen} />
    </TimerStack.Navigator>
  );
}

const TaskStack = createStackNavigator();

function TaskStackScreen() {
  return (
    <TaskStack.Navigator>
      <TaskStack.Screen name="Todos" component={TodoScreen} />
    </TaskStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function CustomNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Project" component={ProjectStackScreen} />
        <Tab.Screen name="Timer" component={TimerStackScreen} />
        <Tab.Screen name="Task" component={TaskStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
