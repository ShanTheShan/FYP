import { React, useState, useEffect, useContext } from "react";
import { Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { useIsFocused } from "@react-navigation/native";

import { noteScreenStyles } from "./styles/NotesScreenStyle";

import { AddButton } from "../components/customButtons";
import { MyPlaceHolder } from "../components/customPlaceHolder";
import { DeleteCellModal } from "../components/customDeleteModal";

import { db } from "../constants/database";

import { themeContext } from "../context/themeContext";

export default function NotesScreen({ navigation }) {
  //global theme state
  const { currentTheme } = useContext(themeContext);

  //delete modal
  const [modalVisible, setModalVisible] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [userNotes, setUserNotes] = useState([]);

  const isFocused = useIsFocused();

  const getAllNotes = async () => {
    try {
      const allRows = await db.getAllAsync("SELECT * FROM Notes");

      setUserNotes(allRows);
    } catch (error) {
      console.log("getAllNotes() error: ", error);
    }
  };

  //param is the note state
  const deleteNote = async (value) => {
    try {
      await db.runAsync("DELETE FROM Notes WHERE note =?", [value]);

      setToDelete(null);
      setModalVisible(false);
      getAllNotes();
    } catch (error) {
      console.log("deleteNote() error: ", error);
    }
  };

  //when the page is in focus, this side effect happens
  useEffect(() => {
    if (isFocused) {
      getAllNotes();
    }
  }, [isFocused]);

  //custom cell for project board page
  const NoteCell = (props) => {
    const taskImage = props.customImage;

    return (
      <TouchableOpacity
        onLongPress={() => {
          setModalVisible(true);
          setToDelete(props.note);
        }}
      >
        <Cell
          key={props.key}
          onPress={false}
          backgroundColor={props.theme}
          titleTextColor={props.textColor}
          {...props}
          cellContentView={
            <View>
              <Text style={[{ fontSize: 20, paddingBottom: 5 }, { color: props.textColor }]}>
                {props.note}
              </Text>
              {taskImage != null || undefined ? (
                <View>
                  <Image source={{ uri: taskImage }} style={noteScreenStyles.image} />
                </View>
              ) : null}
            </View>
          }
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={
        currentTheme === "dark" ? noteScreenStyles.safeAreaDark : noteScreenStyles.safeAreaLight
      }
    >
      {userNotes.length == 0 ? (
        <MyPlaceHolder offsetTop={"50%"} currentTheme={currentTheme} value={"notes"} />
      ) : (
        <ScrollView
          style={
            currentTheme === "dark"
              ? noteScreenStyles.scrollViewDark
              : noteScreenStyles.scrollViewLight
          }
        >
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
              {modalVisible ? (
                <DeleteCellModal
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  deleteObj={deleteNote}
                  toDelete={toDelete}
                  currentTheme={currentTheme}
                  text="note"
                />
              ) : null}
            </Section>
          </TableView>
        </ScrollView>
      )}

      <AddButton
        press={() => {
          navigation.navigate("Create Note", { photoUri: null });
        }}
      />
    </SafeAreaView>
  );
}
