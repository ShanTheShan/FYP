import { React, useContext, useEffect, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
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

// navigation stack object
const ProjectStack = createStackNavigator();

//a stack for each bottom navigation
function ProjectStackScreen({ navigation }) {
  const headerBackground = useHeaderBackground();
  const headerTitle = useHeaderTitle();

  return (
    <ProjectStack.Navigator>
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
    <TimerStack.Navigator>
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
    <TaskStack.Navigator>
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
    <NotesStack.Navigator>
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

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: headerBackground,
          },
        }}
      >
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
