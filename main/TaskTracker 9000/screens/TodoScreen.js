import { React, useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { TableView, Section } from "react-native-tableview-simple";
import { Calendar } from "react-native-calendars";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";

import moment from "moment";

import { db } from "../constants/database";

import { DeleteCellModal } from "../components/customModals";
import { TodoCell } from "../components/customCells";
import { todoScreenStyles } from "./styles/TodoScreenStyle";
import { themeContext } from "../context/themeContext";
import { AddButton } from "../components/customButtons";
import { MyPlaceHolder } from "../components/customPlaceHolder";

export default function TodoScreen({ navigation }) {
  const isFocused = useIsFocused();

  //global theme state
  const { currentTheme } = useContext(themeContext);

  const [todos, setTodos] = useState([]);

  //states to determine date
  const today = moment().format("YYYY-MM-DD");
  const [dateSelected, setDateSelected] = useState(today);
  const [markedDates, setMarkedDates] = useState({});

  //create modal state
  const [todoModal, toggleTodoModal] = useState(false);
  const [input, setInput] = useState("");

  //delete modal state
  const [deleteModal, toggleDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [placeholderText, setPlaceHolderText] = useState();

  const getAll = async (value) => {
    try {
      const allRows = await db.getAllAsync("SELECT * FROM Todos WHERE date = ?", [value]);
      setTodos(allRows);
    } catch (error) {
      console.log("getAll()", error);
    }
  };

  const getAllDates = async () => {
    try {
      const allRows = await db.getAllAsync("SELECT DISTINCT * FROM Todos");
      //Calendar marked dates must be of object type
      const object = allRows.reduce((obj, item) => {
        const dotColor = item.done === "yes" ? "grey" : "orange";
        return Object.assign(obj, { [item.date]: { marked: true, dotColor: dotColor } });
      }, {});
      setMarkedDates(object);
    } catch (error) {
      console.log("getAllDates()", error);
    }
  };

  //run on mount
  useEffect(() => {
    getAll(today);
    getAllDates();
  }, []);

  //run when screen in focused
  useEffect(() => {
    if (isFocused) {
      getAll(dateSelected);
      getAllDates();
    }
  }, [isFocused]);

  const handleDayPress = async (day) => {
    setDateSelected(day.dateString);
    await getAll(day.dateString);
  };

  const createNewTodo = async (value) => {
    //check if text input empty
    if (!input) {
      return;
    }

    try {
      await db.runAsync("INSERT INTO Todos (date,todo,done) VALUES (?,?,?)", [
        dateSelected,
        value,
        "no",
      ]);
      await getAll(dateSelected);
      setInput("");
      getAllDates();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (value) => {
    try {
      await db.runAsync("DELETE FROM Todos WHERE todo =?", [value]);
      await getAll(dateSelected);
      setToDelete(null);
      toggleDeleteModal(false);
      getAllDates();
    } catch (error) {
      console.log(error);
    }
  };

  //handle todo completed style
  const handleStrikeThrough = async (value, isCompleted) => {
    try {
      if (isCompleted === "yes") {
        await db.runAsync("UPDATE Todos SET done = ? WHERE todo =?", ["no", value]);
        await getAll(dateSelected);
        return;
      }

      await db.runAsync("UPDATE Todos SET done = ? WHERE todo =?", ["yes", value]);

      await getAll(dateSelected);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (dateSelected == today) {
      setPlaceHolderText("todos today");
    } else {
      let dateString = dateSelected;
      dateString = dateString.substring(5);
      dateString = dateString.split("-");
      dateString = dateString[1] + "/" + dateString[0];
      setPlaceHolderText(`todos on ${dateString}`);
    }
  }, [dateSelected]);

  return (
    <SafeAreaView
      style={
        currentTheme === "dark" ? todoScreenStyles.safeAreaDark : todoScreenStyles.safeAreaLight
      }
    >
      <TouchableOpacity
        onPress={() => setCalendarVisible(!calendarVisible)}
        style={{ alignItems: "center", paddingVertical: 15 }}
      >
        <FontAwesome
          name="calendar"
          size={24}
          color={currentTheme === "dark" ? "white" : "black"}
        />
      </TouchableOpacity>
      {calendarVisible ? (
        <View key={currentTheme}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              ...markedDates,
              [dateSelected]: { selected: true },
            }}
            theme={
              currentTheme === "dark"
                ? todoScreenStyles.calendarThemeDark
                : todoScreenStyles.calendarThemeLight
            }
          />
        </View>
      ) : null}

      <Modal
        animationType="fade"
        transparent={true}
        visible={todoModal}
        statusBarTranslucent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <View
            style={
              currentTheme === "dark"
                ? todoScreenStyles.modalDarkView
                : todoScreenStyles.modalLightView
            }
          >
            <TextInput
              style={
                currentTheme === "dark"
                  ? todoScreenStyles.textInputDark
                  : todoScreenStyles.textInputLight
              }
              placeholder="Enter todo..."
              onChangeText={(newText) => setInput(newText)}
              placeholderTextColor={currentTheme === "dark" ? "white" : "black"}
              defaultValue={input}
            />
            <TouchableOpacity
              style={todoScreenStyles.buttonEnter}
              onPress={() => {
                toggleTodoModal(false);
                createNewTodo(input);
                setInput("");
              }}
            >
              <Text style={{ color: "white" }}>Create Todo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={todoScreenStyles.buttonClose}
              onPress={() => {
                toggleTodoModal(false);
                setInput("");
              }}
            >
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {todos.length == 0 ? (
        <MyPlaceHolder offsetTop={"20%"} value={placeholderText} currentTheme={currentTheme} />
      ) : (
        <ScrollView
          style={
            currentTheme === "dark"
              ? todoScreenStyles.scrollViewDark
              : todoScreenStyles.scrollViewLight
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
              {todos.map((item) => {
                return (
                  <TodoCell
                    key={item.id}
                    title={item.todo}
                    done={item.done}
                    reminder={item.reminder}
                    toggleDeleteModal={toggleDeleteModal}
                    setToDelete={setToDelete}
                    handleStrikeThrough={handleStrikeThrough}
                    theme={currentTheme}
                    textColor={currentTheme}
                  />
                );
              })}
              {deleteModal ? (
                <DeleteCellModal
                  modalVisible={deleteModal}
                  setModalVisible={toggleDeleteModal}
                  deleteFn={deleteTodo}
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
          //toggleTodoModal(true);
          navigation.navigate("Create Todo", { dateSelected: dateSelected });
        }}
      />
    </SafeAreaView>
  );
}
