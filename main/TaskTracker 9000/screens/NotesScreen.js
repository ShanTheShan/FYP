import { React, useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { useIsFocused } from "@react-navigation/native";

import { AddButton } from "../components/customButtons";

import { db } from "../constants/database";

import { themeContext } from "../context/themeContext";

//custom cell for project board page
const NoteCell = (props) => {
  const taskImage = props.customImage;

  return (
    <Cell
      key={props.key}
      onPress={false}
      backgroundColor={props.theme}
      titleTextColor={props.textColor}
      {...props}
      cellContentView={
        <View>
          <TouchableOpacity
            onLongPress={() => {
              console.log("Long Press");
            }}
          >
            <Text style={[{ fontSize: 20, paddingBottom: 5 }, { color: props.textColor }]}>
              {props.note}
            </Text>
            {taskImage != null || undefined ? (
              <View>
                <Image source={{ uri: taskImage }} style={styles.image} />
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      }
    />
  );
};

export default function NotesScreen({ navigation }) {
  //global theme state
  const { currentTheme } = useContext(themeContext);

  const [userNotes, setUserNotes] = useState([]);

  const isFocused = useIsFocused();

  const getAllNotes = async () => {
    try {
      const allRows = await db.getAllAsync("SELECT * FROM Notes");

      setUserNotes(allRows);
      console.log(allRows);
    } catch (error) {
      console.log("getAllNotes() error: ", error);
    }
  };

  //when the page is in focus, this side effect happens
  useEffect(() => {
    if (isFocused) {
      getAllNotes();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={currentTheme === "dark" ? styles.scrollViewDark : styles.scrollViewLight}>
        <TableView>
          <Section>
            {userNotes.map((item, i) => (
              <NoteCell
                key={i}
                note={item.note}
                customImage={item.image}
                textColor={currentTheme === "dark" ? "#FFFFFF" : "#000000"}
                backgroundColor={currentTheme === "dark" ? "#141414" : "#F6F6F6"}
              />
            ))}
          </Section>
        </TableView>
      </ScrollView>
      <AddButton
        press={() => {
          navigation.navigate("Create Note", { photoUri: null });
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
  image: {
    margin: "5%",
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});
