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
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { Calendar } from "react-native-calendars";

import moment from "moment";

import { db } from "../constants/database";

import { DeleteCellModal } from "../components/customDeleteModal";
import { todoScreenStyles } from "./styles/TodoScreenStyle";
import { themeContext } from "../context/themeContext";
import { AddButton } from "../components/customButtons";
import { MyPlaceHolder } from "../components/customPlaceHolder";

export default function TodoScreen() {
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
      const allRows = await db.getAllAsync("SELECT DISTINCT date FROM Todos");
      //Calendar marked dates must be of object type
      const object = allRows.reduce(
        (obj, item) => Object.assign(obj, { [item.date]: { marked: true, dotColor: "orange" } }),
        {}
      );
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
      await db.runAsync("INSERT INTO Todos (date,todo) VALUES (?,?)", [dateSelected, value]);
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
  const handleStrikeThrough = async (value) => {
    const strike = "yes";

    try {
      await db.runAsync("UPDATE Todos SET done = ? WHERE todo =?", [strike, value]);

      await getAll(dateSelected);
    } catch (error) {
      console.log(error);
    }
  };

  //custom cell
  const TodoCell = (props) => (
    <TouchableOpacity
      onLongPress={() => {
        toggleDeleteModal(true);
        setToDelete(props.title);
      }}
      onPress={() => {
        handleStrikeThrough(props.title);
      }}
    >
      <Cell
        backgroundColor={props.theme}
        {...props}
        cellContentView={
          <View>
            {/* if todo is done, render strike through, else no strike through */}
            {props.done === "yes" ? (
              <Text
                style={{
                  fontSize: 20,
                  paddingBottom: 5,
                  color: props.textColor,
                  textDecorationLine: "line-through",
                }}
              >
                {props.title}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  paddingBottom: 5,
                  color: props.textColor,
                }}
              >
                {props.title}
              </Text>
            )}
          </View>
        }
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={
        currentTheme === "dark" ? todoScreenStyles.safeAreaDark : todoScreenStyles.safeAreaLight
      }
    >
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
        <MyPlaceHolder offsetTop={"20%"} value={"todos today"} currentTheme={currentTheme} />
      ) : (
        <ScrollView
          style={
            currentTheme === "dark"
              ? todoScreenStyles.scrollViewDark
              : todoScreenStyles.scrollViewLight
          }
        >
          <TableView>
            <Section>
              {todos.map((item) => {
                return (
                  <TodoCell
                    key={item.id}
                    title={item.todo}
                    done={item.done}
                    theme={currentTheme === "dark" ? "#141414" : "#F6F6F6"}
                    textColor={currentTheme === "dark" ? "#FFFFFF" : "#000000"}
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
          toggleTodoModal(true);
        }}
      />
    </SafeAreaView>
  );
}
