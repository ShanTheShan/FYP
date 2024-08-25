import { React, useState, useEffect, useContext } from "react";
import { Text, View, Image, SafeAreaView, ScrollView } from "react-native";
import { TableView, Cell, Section } from "react-native-tableview-simple";
import { useIsFocused } from "@react-navigation/native";
import { Gesture, GestureDetector, TouchableOpacity } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { noteScreenStyles } from "./styles/NotesScreenStyle";

import { AddButton } from "../components/customButtons";
import { MyPlaceHolder } from "../components/customPlaceHolder";
import { EditCellModal, DeleteCellModal, ShowImageCellModal } from "../components/customModals";

import { db } from "../constants/database";

import { themeContext } from "../context/themeContext";

export default function NotesScreen({ navigation }) {
  //global theme state
  const { currentTheme } = useContext(themeContext);

  //edit notes
  const [input, setInput] = useState();
  const [noteID, setNoteID] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  //delete modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  //image preview
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageToShow, setImageToShow] = useState();

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

  //param is the note id
  const updateNote = async (value, id) => {
    try {
      await db.runAsync("UPDATE Notes SET note = ? WHERE id = ?", [value, id]);
      getAllNotes();
      setEditModalVisible(false);
    } catch (error) {
      console.log("updateNote(): ", error);
    }
  };

  //param is the note state
  const deleteNote = async (value) => {
    try {
      await db.runAsync("DELETE FROM Notes WHERE note =?", [value]);

      setToDelete(null);
      setDeleteModalVisible(false);
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

  const showImage = (value) => {
    setImageToShow(value);
    setImageModalVisible(true);
  };

  //custom cell for project board page
  const NoteCell = (props) => {
    //for double tap handling
    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd((_event, successful) => {
        if (successful) {
          //gesture handle runs on UI thread, states is React (JavaScript)
          runOnJS(setNoteID)(props.id);
          runOnJS(setInput)(props.note);
          runOnJS(setEditModalVisible)(true);
        }
      });

    const taskImage = props.customImage;

    return (
      <GestureDetector gesture={doubleTap}>
        <TouchableOpacity
          onLongPress={() => {
            setDeleteModalVisible(true);
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
                <Text
                  style={[
                    { fontSize: 20, paddingBottom: 5, flex: 1, flexWrap: "wrap" },
                    { color: props.textColor },
                  ]}
                >
                  {props.note}
                </Text>
                {taskImage != null || undefined ? (
                  <View>
                    <TouchableOpacity onPress={() => showImage({ uri: taskImage })}>
                      <Image source={{ uri: taskImage }} style={noteScreenStyles.image} />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            }
          />
        </TouchableOpacity>
      </GestureDetector>
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
          <TableView
            appearance={"customKey"}
            customAppearances={{
              customKey: {
                colors: {
                  background: currentTheme === "dark" ? "black" : "white",
                  separatorColor: currentTheme === "dark" ? "white" : "black",
                  body: currentTheme === "dark" ? "white" : "black",
                  secondary: currentTheme === "dark" ? "white" : "black",
                },
              },
            }}
          >
            <Section>
              {userNotes.map((item, i) => (
                <NoteCell
                  key={i}
                  id={item.id}
                  note={item.note}
                  customImage={item.image}
                  textColor={currentTheme === "dark" ? "#FFFFFF" : "#000000"}
                  backgroundColor={currentTheme === "dark" ? "#141414" : "#F6F6F6"}
                />
              ))}
              {deleteModalVisible ? (
                <DeleteCellModal
                  modalVisible={deleteModalVisible}
                  setModalVisible={setDeleteModalVisible}
                  deleteFn={deleteNote}
                  toDelete={toDelete}
                  currentTheme={currentTheme}
                  text="note"
                />
              ) : null}
              {editModalVisible ? (
                <EditCellModal
                  modalVisible={editModalVisible}
                  setModalVisible={setEditModalVisible}
                  text={input}
                  textID={noteID}
                  updateText={updateNote}
                  currentTheme={currentTheme}
                />
              ) : null}
              {imageModalVisible ? (
                <ShowImageCellModal
                  modalVisible={imageModalVisible}
                  setModalVisible={setImageModalVisible}
                  image={imageToShow}
                  currentTheme={currentTheme}
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
