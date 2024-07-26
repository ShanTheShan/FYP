import { useState } from "react";
import { React } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput } from "react-native";

export const EditCellModal = ({ modalVisible, note, updateNote, noteID, currentTheme }) => {
  //need to have a input state here to edit the text, we cant pass setInput as a prop
  const [input, setInput] = useState(note);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
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
          style={currentTheme === "dark" ? styles.deleteModalDarkView : styles.deleteModalLightView}
        >
          <TextInput
            style={currentTheme === "dark" ? styles.textInputDark : styles.textInputLight}
            value={input}
            onChangeText={(newText) => setInput(newText)}
            placeholderTextColor={currentTheme === "dark" ? "white" : "black"}
          />
          <TouchableOpacity
            style={styles.buttonEnter}
            onPress={() => {
              updateNote(input, noteID);
            }}
          >
            <Text style={{ color: "white" }}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  buttonEnter: {
    borderRadius: 20,
    padding: 15,
    marginTop: 10,
    elevation: 2,
    backgroundColor: "darkgreen",
  },
  buttonClose: {
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
    backgroundColor: "darkred",
  },
  textInputDark: {
    borderColor: "white",
    color: "white",
    height: 100,
    width: 150,
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
