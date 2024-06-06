import { React, useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, Modal, Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import Carousel from "react-native-reanimated-carousel";

import TimerScreen from "./screens/timer";
import RenderCamera from "./screens/camera";
import ProjectScreen from "./screens/project";
import TaskScreen from "./screens/tasks";
import ProjectTaskScreen from "./screens/projectTask";

import { db } from "./database";

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

function HomeScreen({ navigation }) {
  //tutorial state
  const [modalVisible, setModalVisible] = useState(true);

  //array of images for tutorial
  const tutorialImages = [
    require("./assets/tutorial_overview.jpg"),
    require("./assets/tutorial_visual.jpg"),
    require("./assets/tutorial_timer.jpg"),
  ];

  //query created projects
  //project names state
  const [projects, storeProjects] = useState([]);
  useEffect(() => {
    const getAll = async () => {
      try {
        console.log("collect projects object");
        const allRows = await db.getAllAsync("SELECT * FROM Projects");
        storeProjects(allRows);
      } catch (error) {
        console.log(error);
      }
    };

    getAll();
  }, []); //empty dependency array to run effect only once

  return (
    <SafeAreaView>
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <Carousel
              loop
              width={200}
              height={300}
              autoPlay={false}
              data={tutorialImages}
              renderItem={({ item }) => (
                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    justifyContent: "center",
                  }}
                >
                  <Image source={item} style={styles.image} />
                </View>
              )}
            />
            <Text
              style={{
                flex: 1,
              }}
            >
              This is a tutorial showing how the app works. This feature prototype houses the
              initial functionality proposed in the preliminary report. The project management page,
              and the focus tool (TIMER).
            </Text>

            <Pressable style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>OKAY</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
      <TableView>
        <Section>
          {/* <HomescreenCell
                  action={() => navigation.navigate("Project_Details")}
                  title="Project 1"
                />
                <HomescreenCell
                  action={() => navigation.navigate("Project_Details")}
                  title="Project 2"
                /> */}
          {projects.map((item) => {
            return (
              <HomescreenCell
                action={() => navigation.navigate("Project_Details", { id: item.id })}
                key={item.id}
                title={item.projectName}
              />
            );
          })}
        </Section>
      </TableView>
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
      <TimerStack.Screen name="Focus Tool 52/17" component={TimerScreen} />
    </TimerStack.Navigator>
  );
}

const TaskStack = createStackNavigator();

function TaskStackScreen() {
  return (
    <TaskStack.Navigator>
      <TaskStack.Screen name="Tasks" component={TaskScreen} />
    </TaskStack.Navigator>
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
        <Tab.Screen name="Task" component={TaskStackScreen} />
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
