import { React, useContext } from "react";
import { TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import TimerScreen from "../screens/TimerScreen";
import RenderCamera from "../screens/CameraScreen";
import ProjectDetails from "../screens/ProjectDetailsScreen";
import TodoScreen from "../screens/TodoScreen";
import ProjectTaskScreen from "../screens/TaskCreationScreen";
import NotesScreen from "../screens/NotesScreen";
import NoteCreationScreen from "../screens/NoteCreationScreen";
import SettingsScreen from "../screens/SettingsScreen";

import useHeaderBackground from "../hooks/headerBackground";
import useHeaderTitle from "../hooks/headerTitle";

import { Entypo } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import { themeContext } from "../context/themeContext";

//fade transition betweens screens, from the react nav doc
const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

// navigation stack object
const ProjectStack = createStackNavigator();

//a stack for each bottom navigation
function ProjectStackScreen({ navigation }) {
  const headerBackground = useHeaderBackground();
  const headerTitle = useHeaderTitle();

  return (
    <ProjectStack.Navigator
      screenOptions={{
        animationEnabled: true,
        cardStyleInterpolator: forFade,
      }}
    >
      <ProjectStack.Screen
        name="Projects Overview"
        component={HomeScreen}
        options={{
          headerTitleStyle: { color: headerTitle },
          headerStyle: {
            backgroundColor: headerBackground,
          },
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
      <ProjectStack.Screen
        name="Project Details"
        component={ProjectDetails}
        options={{
          headerTintColor: headerTitle,
          headerTitleStyle: { color: headerTitle },
          headerStyle: {
            backgroundColor: headerBackground,
          },
        }}
      />
      <ProjectStack.Screen
        name="Camera"
        component={RenderCamera}
        options={{ headerShown: false }}
      />
      <ProjectStack.Screen
        name="Create Task"
        component={ProjectTaskScreen}
        options={{
          headerTintColor: headerTitle,
          headerTitleStyle: { color: headerTitle },
          headerStyle: {
            backgroundColor: headerBackground,
          },
        }}
      />
    </ProjectStack.Navigator>
  );
}

const TimerStack = createStackNavigator();

function TimerStackScreen({ navigation }) {
  const headerBackground = useHeaderBackground();
  const headerTitle = useHeaderTitle();

  return (
    <TimerStack.Navigator
      screenOptions={{
        animationEnabled: true,
        cardStyleInterpolator: forFade,
      }}
    >
      <TimerStack.Screen
        name="Focus Tool"
        component={TimerScreen}
        options={{
          headerTitleStyle: { color: headerTitle },
          headerStyle: {
            backgroundColor: headerBackground,
          },
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
  const headerBackground = useHeaderBackground();
  const headerTitle = useHeaderTitle();

  return (
    <TaskStack.Navigator
      screenOptions={{
        animationEnabled: true,
        cardStyleInterpolator: forFade,
      }}
    >
      <TaskStack.Screen
        name="Todos"
        component={TodoScreen}
        options={{
          headerTitleStyle: { color: headerTitle },
          headerStyle: {
            backgroundColor: headerBackground,
          },
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
  const headerBackground = useHeaderBackground();
  const headerTitle = useHeaderTitle();

  return (
    <NotesStack.Navigator
      screenOptions={{
        animationEnabled: true,
        cardStyleInterpolator: forFade,
      }}
    >
      <NotesStack.Screen
        name="My Notes"
        component={NotesScreen}
        options={{
          headerTitleStyle: { color: headerTitle },
          headerStyle: {
            backgroundColor: headerBackground,
          },
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
      <NotesStack.Screen
        name="Create Note"
        component={NoteCreationScreen}
        options={{
          headerTintColor: headerTitle,
          headerTitleStyle: { color: headerTitle },
          headerStyle: {
            backgroundColor: headerBackground,
          },
        }}
      />
      <NotesStack.Screen
        name="Camera Note"
        component={RenderCamera}
        options={{ headerShown: false }}
      />
    </NotesStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

//hiding the settings tab, but still navigable
export default function CustomNavigator() {
  const headerBackground = useHeaderBackground();
  //global theme state
  const { currentTheme } = useContext(themeContext);
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: headerBackground,
          },
          tabBarItemStyle: {
            marginVertical: 5,
          },
        }}
      >
        <Tab.Screen
          name="Project"
          component={ProjectStackScreen}
          options={{
            tabBarIcon: ({}) => (
              <Entypo
                name="blackboard"
                size={20}
                color={currentTheme === "dark" ? "white" : "black"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Timer"
          component={TimerStackScreen}
          options={{
            tabBarIcon: ({}) => (
              <Entypo
                name="stopwatch"
                size={20}
                color={currentTheme === "dark" ? "white" : "black"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Notes"
          component={NotesStackScreen}
          options={{
            tabBarIcon: ({}) => (
              <Foundation
                name="clipboard-notes"
                size={22}
                color={currentTheme === "dark" ? "white" : "black"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Task"
          component={TaskStackScreen}
          options={{
            tabBarIcon: ({}) => (
              <FontAwesome5
                name="list"
                size={20}
                color={currentTheme === "dark" ? "white" : "black"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarItemStyle: { display: "none" } }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
