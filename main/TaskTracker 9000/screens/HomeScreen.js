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

import { StatusBar } from "expo-status-bar";

import { db } from "../constants/database";
import { AddButton } from "../components/customButtons";

import { themeContext } from "../context/themeContext";

import useStatusBarStyle from "../hooks/statusBar";
//import { TouchableOpacity } from "react-native-gesture-handler";

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
          progress={0.5}
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

  //query created projects
  //project names state
  const [projects, storeProjects] = useState([]);

  useEffect(() => {
    const getAll = async () => {
      try {
        const allRows = await db.getAllAsync("SELECT * FROM Projects");
        storeProjects(allRows);
      } catch (error) {
        console.log(error);
      }
    };

    getAll();
  }, [projects]);

  const createNewProject = async (value) => {
    try {
      await db.runAsync("INSERT INTO Projects VALUES (?,?)", [null, value]);
      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={statusBarColor} style={statusBarTextColor} />
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
              Lorem Impsum.
            </Text>

            <Pressable style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>OKAY</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
      <ScrollView style={currentTheme === "dark" ? styles.scrollViewDark : styles.scrollViewLight}>
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
                    ? styles.createProjectModalDarkView
                    : styles.createProjectModalLightView
                }
              >
                <TextInput
                  style={currentTheme === "dark" ? styles.textInputDark : styles.textInputLight}
                  placeholder="Enter project name..."
                  onChangeText={(newText) => setInput(newText)}
                  placeholderTextColor={currentTheme === "dark" ? "white" : "black"}
                  defaultValue={input}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setCreateProjectModalVisible(false);
                    createNewProject(input);
                  }}
                >
                  <Text style={{ color: "white" }}>Create Project</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => {
                    setCreateProjectModalVisible(false);
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
                    action={() => navigation.navigate("Project_Details", { id: item.id })}
                    key={item.id}
                    title={item.projectName}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  safeArea: {
    flex: 1,
    height: "100%",
  },
  scrollViewLight: {
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  scrollViewDark: {
    height: "100%",
    backgroundColor: "#1C1C1C",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    elevation: 2,
    backgroundColor: "darkgreen",
  },
  buttonClose: {
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    elevation: 2,
    backgroundColor: "darkred",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  createProjectModalDarkView: {
    backgroundColor: "#1F1F1F",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 10,
  },
  createProjectModalLightView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 10,
  },
  textInputDark: {
    borderColor: "white",
    color: "white",
    height: 40,
    width: 155,
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 10,
    paddingLeft: 5,
  },
  textInputLight: {
    borderColor: "black",
    height: 40,
    width: 155,
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 10,
    paddingLeft: 5,
  },
});
