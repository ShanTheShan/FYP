import { React, useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, Modal, Pressable } from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import Carousel from "react-native-reanimated-carousel";

import { db } from "../constants/database";

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
  //tutorial state
  const [modalVisible, setModalVisible] = useState(true);

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
