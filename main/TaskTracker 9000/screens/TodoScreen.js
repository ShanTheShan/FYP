import { React, useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { Calendar } from "react-native-calendars";

import moment from "moment";

import { db } from "../constants/database";

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
      console.log(error);
    }
  };

  //run on mount
  useEffect(() => {
    getAll(today);
  }, []);

  const handleDayPress = async (day) => {
    setDateSelected(day.dateString);
    await getAll(day.dateString);
  };

  const createNewTodo = async (value) => {
    try {
      await db.runAsync("INSERT INTO Todos (date,todo) VALUES (?,?)", [dateSelected, value]);
      await getAll(dateSelected);
      setInput("");
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
    <Cell
      backgroundColor={props.theme}
      {...props}
      cellContentView={
        <View>
          <TouchableOpacity
            onLongPress={() => {
              toggleDeleteModal(true);
              setToDelete(props.title);
            }}
            onPress={() => {
              handleStrikeThrough(props.title);
            }}
          >
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
          </TouchableOpacity>
        </View>
      }
    />
  );

  return (
    <SafeAreaView style={currentTheme === "dark" ? styles.safeAreaDark : styles.safeAreaLight}>
      <View>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [dateSelected]: { selected: true },
          }}
          theme={currentTheme === "dark" ? styles.calendarThemeDark : styles.calendarThemeLight}
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
          <View style={currentTheme === "dark" ? styles.modalDarkView : styles.modalLightView}>
            <TextInput
              style={currentTheme === "dark" ? styles.textInputDark : styles.textInputLight}
              placeholder="Enter todo..."
              onChangeText={(newText) => setInput(newText)}
              placeholderTextColor={currentTheme === "dark" ? "white" : "black"}
              defaultValue={input}
            />
            <TouchableOpacity
              style={styles.buttonEnter}
              onPress={() => {
                toggleTodoModal(false);
                createNewTodo(input);
                setInput("");
              }}
            >
              <Text style={{ color: "white" }}>Create Todo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonClose}
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
          style={currentTheme === "dark" ? styles.scrollViewDark : styles.scrollViewLight}
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
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={deleteModal}
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
                          ? styles.deleteModalDarkView
                          : styles.deleteModalLightView
                      }
                    >
                      <Text
                        style={currentTheme === "dark" ? { color: "white" } : { color: "black" }}
                      >
                        Do you want to delete this todo?
                      </Text>

                      <TouchableOpacity
                        style={styles.buttonEnter}
                        onPress={() => {
                          toggleDeleteModal(false);
                          deleteTodo(toDelete);
                        }}
                      >
                        <Text style={{ color: "white" }}>YES</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.buttonClose}
                        onPress={() => {
                          toggleDeleteModal(false);
                        }}
                      >
                        <Text style={{ color: "white" }}>NO</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
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

const styles = StyleSheet.create({
  safeAreaDark: {
    flex: 1,
    height: "100%",
    backgroundColor: "#1C1C1C",
  },
  safeAreaLight: {
    flex: 1,
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  scrollViewLight: {
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  scrollViewDark: {
    height: "100%",
    backgroundColor: "#1C1C1C",
  },
  calendarThemeDark: {
    backgroundColor: "black",
    calendarBackground: "black",
    textSectionTitleColor: "white",
    dayTextColor: "white",
    textDisabledColor: "grey",
    monthTextColor: "white",
  },
  calendarThemeLight: {
    backgroundColor: "white",
    textSectionTitleColor: "black",
  },
  modalDarkView: {
    backgroundColor: "#1F1F1F",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 10,
  },
  modalLightView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 10,
  },
  deleteModalDarkView: {
    backgroundColor: "#1F1F1F",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 10,
  },
  deleteModalLightView: {
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
  buttonEnter: {
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
});
