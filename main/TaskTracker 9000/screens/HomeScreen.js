import { React, useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import * as Progress from "react-native-progress";
import Carousel from "react-native-reanimated-carousel";

import { useIsFocused } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";

import { db } from "../constants/database";
import { AddButton } from "../components/customButtons";

import { themeContext } from "../context/themeContext";
import { homeScreenStyles } from "./styles/HomeScreenStyles";

import useStatusBarStyle from "../hooks/statusBar";

//custom cell for project board page
const HomescreenCell = (props) => (
  <Cell
    onPress={props.action}
    backgroundColor={props.theme}
    {...props}
    cellContentView={
      <View>
        <Text style={[{ fontSize: 20, paddingBottom: 5 }, { color: props.textColor }]}>
          {props.title}
        </Text>
        <Progress.Bar
          style={{ marginBottom: 5 }}
          progress={props.progressValue}
          width={200}
          borderColor="black"
          borderWidth={1}
          height={20}
          color="green"
          unfilledColor="#B9B9B9"
        />
      </View>
    }
  />
);

export default function HomeScreen({ navigation }) {
  //if screen is focused
  const isFocused = useIsFocused();

  //global theme state
  const { currentTheme } = useContext(themeContext);

  //tutorial state modal
  const [modalVisible, setModalVisible] = useState(true);

  //create a project state modal
  const [createProjectModal, setCreateProjectModalVisible] = useState(false);

  //text input state
  const [input, setInput] = useState("");

  //status bar theme
  const [statusBarColor, statusBarTextColor] = useStatusBarStyle();

  //array of images for tutorial
  const tutorialImages = [
    require("../assets/tutorial_overview.jpg"),
    require("../assets/tutorial_visual.jpg"),
    require("../assets/tutorial_timer.jpg"),
  ];

  //project names state
  const [projects, storeProjects] = useState([]);

  const getAll = async () => {
    try {
      const allRows = await db.getAllAsync("SELECT * FROM Projects");
      storeProjects(allRows);
    } catch (error) {
      console.log(error);
    }
  };

  //run on mount
  useEffect(() => {
    getAll();
  }, []);

  //run when a project is deleted, and we are back to home page
  useEffect(() => {
    if (isFocused) {
      getAll();
    }
  }, [isFocused]);

  const createNewProject = async (value) => {
    try {
      await db.runAsync("INSERT INTO Projects (projectName,progress) VALUES (?,?)", [value, 0]);
      //fetch the updated list of projects after insertion
      await getAll();
      setInput("");
    } catch (error) {
      console.log(error);
      s;
    }
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={statusBarColor} style={statusBarTextColor} />
      <View style={homeScreenStyles.centeredView}>
        <Modal
          animationType="fade"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={homeScreenStyles.centeredView}>
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
                  <Image source={item} style={homeScreenStyles.image} />
                </View>
              )}
            />
            <Text
              style={{
                flex: 1,
              }}
            >
              Lorem Impsum.
            </Text>

            <Pressable
              style={homeScreenStyles.button}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={homeScreenStyles.textStyle}>OKAY</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
      <ScrollView
        style={
          currentTheme === "dark"
            ? homeScreenStyles.scrollViewDark
            : homeScreenStyles.scrollViewLight
        }
      >
        {createProjectModal ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={createProjectModal}
            statusBarTranslucent={true}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={
                  currentTheme === "dark"
                    ? homeScreenStyles.createProjectModalDarkView
                    : homeScreenStyles.createProjectModalLightView
                }
              >
                <TextInput
                  style={
                    currentTheme === "dark"
                      ? homeScreenStyles.textInputDark
                      : homeScreenStyles.textInputLight
                  }
                  placeholder="Enter project name..."
                  onChangeText={(newText) => setInput(newText)}
                  placeholderTextColor={currentTheme === "dark" ? "white" : "black"}
                  defaultValue={input}
                />
                <TouchableOpacity
                  style={homeScreenStyles.button}
                  onPress={() => {
                    setCreateProjectModalVisible(false);
                    createNewProject(input);
                    setInput("");
                  }}
                >
                  <Text style={{ color: "white" }}>Create Project</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={homeScreenStyles.buttonClose}
                  onPress={() => {
                    setCreateProjectModalVisible(false);
                    setInput("");
                  }}
                >
                  <Text style={{ color: "white" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : (
          <TableView>
            <Section>
              {projects.map((item) => {
                return (
                  <HomescreenCell
                    action={() => navigation.navigate("Project Details", { id: item.id })}
                    key={item.id}
                    title={item.projectName}
                    progressValue={item.progress}
                    theme={currentTheme === "dark" ? "#141414" : "#F6F6F6"}
                    textColor={currentTheme === "dark" ? "#FFFFFF" : "#000000"}
                  />
                );
              })}
            </Section>
          </TableView>
        )}
      </ScrollView>
      <AddButton
        press={() => {
          setCreateProjectModalVisible(true);
        }}
      />
    </SafeAreaView>
  );
}
