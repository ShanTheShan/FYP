import { React } from "react";
import { TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import TimerScreen from "../screens/TimerScreen";
import RenderCamera from "../screens/CameraScreen";
import ProjectDetails from "../screens/ProjectDetailsScreen";
import TodoScreen from "../screens/TodoScreen";
import ProjectTaskScreen from "../screens/TaskCreationScreen";
import NotesScreen from "../screens/NotesScreen";
import SettingsScreen from "../screens/SettingsScreen";

// navigation stack object
const ProjectStack = createStackNavigator();

//a stack for each bottom navigation
function ProjectStackScreen({ navigation }) {
  return (
    <ProjectStack.Navigator>
      <ProjectStack.Screen
        name="Projects Overview"
        component={HomeScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              style={{ paddingRight: 15 }}
              onPress={() => {
                navigation.navigate("Settings");
              }}
            >
              <Text style={{ fontSize: 20 }}>⚙️</Text>
            </TouchableOpacity>
          ),
        }}
      />
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

function TimerStackScreen({ navigation }) {
  return (
    <TimerStack.Navigator>
      <TimerStack.Screen
        name="Focus Tool"
        component={TimerScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              style={{ paddingRight: 15 }}
              onPress={() => {
                navigation.navigate("Settings");
              }}
            >
              <Text style={{ fontSize: 20 }}>⚙️</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </TimerStack.Navigator>
  );
}

const TaskStack = createStackNavigator();

function TaskStackScreen({ navigation }) {
  return (
    <TaskStack.Navigator>
      <TaskStack.Screen
        name="Todos"
        component={TodoScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              style={{ paddingRight: 15 }}
              onPress={() => {
                navigation.navigate("Settings");
              }}
            >
              <Text style={{ fontSize: 20 }}>⚙️</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </TaskStack.Navigator>
  );
}

const NotesStack = createStackNavigator();

function NotesStackScreen({ navigation }) {
  return (
    <NotesStack.Navigator>
      <NotesStack.Screen
        name="My Notes"
        component={NotesScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              style={{ paddingRight: 15 }}
              onPress={() => {
                navigation.navigate("Settings");
              }}
            >
              <Text style={{ fontSize: 20 }}>⚙️</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </NotesStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

//hiding the settings tab, but still navigable
export default function CustomNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Project" component={ProjectStackScreen} />
        <Tab.Screen name="Timer" component={TimerStackScreen} />
        <Tab.Screen name="Notes" component={NotesStackScreen} />
        <Tab.Screen name="Task" component={TaskStackScreen} />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarItemStyle: { display: "none" } }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
