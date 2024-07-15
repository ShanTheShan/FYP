import { React, useState, useEffect, useContext } from "react";
import {
  Text,
  View,
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
import { CarouselItem } from "../components/customCarousel";
import { tutorialImages } from "../constants/carouImages";

import { useIsFocused } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";

import { db } from "../constants/database";
import { AddButton } from "../components/customButtons";
import { MyPlaceHolder } from "../components/customPlaceHolder";
import { DeleteCellModal } from "../components/customDeleteModal";
import { TutorialModal } from "../components/tutorialModal";

import { themeContext } from "../context/themeContext";
import { homeScreenStyles } from "./styles/HomeScreenStyles";

import useStatusBarStyle from "../hooks/statusBar";

export default function HomeScreen({ navigation }) {
  //if screen is focused
  const isFocused = useIsFocused();

  //global theme state
  const { currentTheme } = useContext(themeContext);

  //tutorial state modal
  const [modalVisible, setModalVisible] = useState(true);

  //create a project state modal
  const [createProjectModal, setCreateProjectModalVisible] = useState(false);

  //delete modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  //text input state
  const [input, setInput] = useState("");

  //status bar theme
  const [statusBarColor, statusBarTextColor] = useStatusBarStyle();

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
    }
  };

  const deleteProject = async () => {
    try {
      await db.runAsync(
        "DELETE FROM Projects WHERE id = (SELECT id FROM Projects WHERE projectName = ?)",
        [toDelete]
      );
      getAll();
    } catch (error) {
      console.log(error);
    }
  };

  //custom cell for project board page
  const HomescreenCell = (props) => (
    <Cell
      onPress={props.action}
      onLongPress={() => {
        setDeleteModalVisible(true);
        setToDelete(props.title);
      }}
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

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={statusBarColor} style={statusBarTextColor} />
      <View style={homeScreenStyles.centeredView}>
        <TutorialModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
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
        ) : projects.length == 0 ? (
          <MyPlaceHolder offsetTop={"50%"} currentTheme={currentTheme} value={"projects"} />
        ) : deleteModalVisible ? (
          <DeleteCellModal
            modalVisible={deleteModalVisible}
            setModalVisible={setDeleteModalVisible}
            deleteFn={deleteProject}
            toDelete={toDelete}
            currentTheme={currentTheme}
            text="project"
          />
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
