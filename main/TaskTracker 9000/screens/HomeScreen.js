import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import Carousel from "react-native-reanimated-carousel";

import { StatusBar } from "expo-status-bar";

import { db } from "../constants/database";
import { AddButton } from "../components/customButtons";

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

export default function HomeScreen({ navigation }) {
  //tutorial state modal
  const [modalVisible, setModalVisible] = useState(true);

  //create a project state modal
  const [createProjectModal, setCreateProjectModalVisible] = useState(false);

  //text input state
  const [input, setInput] = useState("");

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
  }, []); //empty dependency array to run effect only once

  const createProject = () => {};

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
      <ScrollView style={styles.scrollView}>
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
                marginVertical: "50%",
              }}
            >
              <View style={styles.createProjectModalView}>
                <TextInput
                  style={{
                    height: 40,
                    width: 150,
                    borderWidth: 1,
                    marginTop: 20,
                    borderRadius: 10,
                  }}
                  placeholder="Enter project name..."
                  onChangeText={(newText) => setInput(newText)}
                  defaultValue={input}
                />
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    setCreateProjectModalVisible(false);
                  }}
                >
                  <Text style={{ color: "white" }}>Create Project</Text>
                </Pressable>
                <Pressable
                  style={styles.buttonClose}
                  onPress={() => {
                    setCreateProjectModalVisible(false);
                  }}
                >
                  <Text style={{ color: "white" }}>Cancel</Text>
                </Pressable>
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
  scrollView: {
    height: "100%",
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
    backgroundColor: "darkgreen",
  },
  buttonClose: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "darkred",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  createProjectModalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
