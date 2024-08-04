import { React, useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import * as Progress from "react-native-progress";

import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StatusBar } from "expo-status-bar";

import { db } from "../constants/database";
import { AddButton } from "../components/customButtons";
import { MyPlaceHolder } from "../components/customPlaceHolder";
import { DeleteCellModal } from "../components/customModals";
import { TutorialModal } from "../components/tutorialModal";

import { themeContext } from "../context/themeContext";
import { homeScreenStyles } from "./styles/HomeScreenStyles";

import useStatusBarStyle from "../hooks/statusBar";

import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

export default function HomeScreen({ navigation }) {
  //if screen is focused
  const isFocused = useIsFocused();

  //global theme state
  const { currentTheme } = useContext(themeContext);

  //tutorial state modal
  const [modalVisible, setModalVisible] = useState(false);

  //create a project state modal
  const [createProjectModal, setCreateProjectModalVisible] = useState(false);

  //delete modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectDetailsToDelete, setProjectDetailsToDelete] = useState(null);

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

  const isTutorialViewed = async () => {
    try {
      const value = await AsyncStorage.getItem("viewed");
      if (value === "true") {
        setModalVisible(false);
        return true;
      }
    } catch (error) {
      console.log("isTutorialViwed(): ", error);
    }
  };

  useEffect(() => {
    const waiting = async () => {
      const viewHistory = await isTutorialViewed();
      await SplashScreen.hideAsync();
      if (viewHistory) {
        return;
      } else {
        setModalVisible(true);
      }
    };

    setTimeout(() => {
      waiting();
    }, 2000);
  }, []);

  // //run on mount
  // useEffect(() => {
  //   getAll();
  //   //isTutorialViewed();
  // }, []);

  useEffect(() => {
    if (isFocused) {
      getAll();
    }
  }, [isFocused]);

  const createNewProject = async (value) => {
    //check if input empty
    if (!input) {
      return;
    }

    try {
      await db.runAsync("INSERT INTO Projects (projectName,progress) VALUES (?,?)", [value, 0]);
      //fetch the updated list of projects after insertion
      await getAll();
      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProject = () => {
    try {
      db.withTransactionAsync(async () => {
        //delete subtasks, then tasks, comments, then project
        await db.runAsync(
          "DELETE FROM ProjectSubTasks WHERE parent_task_id IN (SELECT task_id FROM ProjectDetails WHERE project_id = ?)",
          [projectDetailsToDelete]
        );

        await db.runAsync("DELETE FROM ProjectDetails WHERE project_id = ?", [
          projectDetailsToDelete,
        ]);

        await db.runAsync("DELETE FROM ProjectComments WHERE project_id = ?", [
          projectDetailsToDelete,
        ]);

        await db.runAsync(
          "DELETE FROM Projects WHERE id = (SELECT id FROM Projects WHERE projectName = ?)",
          [projectToDelete]
        );

        getAll();
        setDeleteModalVisible(false);
      });
    } catch (error) {
      console.log("deleteProject() error:", error);
    }
  };

  //custom cell for project board page
  const HomescreenCell = (props) => (
    <Cell
      onPress={props.action}
      onLongPress={() => {
        setDeleteModalVisible(true);
        setProjectToDelete(props.title);
        setProjectDetailsToDelete(props.projectId);
      }}
      backgroundColor={props.theme}
      {...props}
      cellContentView={
        <View style={{ flex: 1 }}>
          <View>
            <Text style={[{ fontSize: 20, paddingBottom: 5 }, { color: props.textColor }]}>
              {props.title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 5,
            }}
          >
            <Progress.Bar
              progress={props.progressValue}
              width={200}
              borderColor="black"
              borderWidth={1}
              height={25}
              color="green"
              unfilledColor="#B9B9B9"
            />
            <Text style={{ fontSize: 17, color: props.textColor }}>
              {Math.round(props.progressValue * 100)}%
            </Text>
          </View>
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
                  multiline={true}
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
            projectToDelete={projectToDelete}
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
                    projectId={item.id}
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
