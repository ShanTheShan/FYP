import { useState } from "react";
import { React } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, Image } from "react-native";

const EditCellModal = ({
  modalVisible,
  setModalVisible,
  text,
  updateText,
  textID,
  currentTheme,
}) => {
  //need to have a input state here to edit the text, we cant pass setInput as a prop
  const [input, setInput] = useState(text);

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
            multiline={true}
            value={input}
            onChangeText={(newText) => setInput(newText)}
            placeholderTextColor={currentTheme === "dark" ? "white" : "black"}
          />
          <TouchableOpacity
            style={styles.buttonEnter}
            onPress={() => {
              updateText(input, textID);
            }}
          >
            <Text style={{ color: "white" }}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonClose}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Text style={{ color: "white" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const AddCellModal = ({ modalVisible, setModalVisible, createCellFn, currentTheme }) => {
  const [input, setInput] = useState("");
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
            multiline={true}
            value={input}
            onChangeText={(newText) => setInput(newText)}
            placeholderTextColor={currentTheme === "dark" ? "white" : "black"}
          />
          <TouchableOpacity
            style={styles.buttonEnter}
            onPress={() => {
              createCellFn(input);
            }}
          >
            <Text style={{ color: "white" }}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonClose}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Text style={{ color: "white" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const DeleteCellModal = ({
  modalVisible,
  setModalVisible,
  deleteFn,
  toDelete,
  currentTheme,
  text,
}) => {
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
          style={
            currentTheme === "dark"
              ? DeleteModalStyles.deleteModalDarkView
              : DeleteModalStyles.deleteModalLightView
          }
        >
          <Text style={currentTheme === "dark" ? { color: "white" } : { color: "black" }}>
            Do you want to delete this {text}?
          </Text>

          <TouchableOpacity
            style={DeleteModalStyles.buttonEnter}
            onPress={() => {
              deleteFn(toDelete);
            }}
          >
            <Text style={{ color: "white" }}>YES</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={DeleteModalStyles.buttonClose}
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <Text style={{ color: "white" }}>NO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const ShowImageCellModal = ({ modalVisible, setModalVisible, currentTheme, image }) => {
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
          style={
            currentTheme === "dark"
              ? ShowImageCellModalStyles.imageModalDarkView
              : ShowImageCellModalStyles.imageModalLightView
          }
        >
          <Image source={image} style={ShowImageCellModalStyles.image} />

          <TouchableOpacity
            style={ShowImageCellModalStyles.buttonClose}
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <Text style={{ color: "white" }}>Close</Text>
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
    height: 150,
    width: 200,
    textAlignVertical: "top",
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 10,
    paddingLeft: 5,
    paddingTop: 5,
    paddingRight: 2,
  },
  textInputLight: {
    borderColor: "black",
    color: "black",
    height: 150,
    width: 200,
    textAlignVertical: "top",
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 10,
    paddingLeft: 5,
    paddingTop: 5,
    paddingRight: 2,
  },
});

const DeleteModalStyles = StyleSheet.create({
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
});

const ShowImageCellModalStyles = StyleSheet.create({
  imageModalDarkView: {
    backgroundColor: "#1F1F1F",
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
  },
  imageModalLightView: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
  },
  image: {
    margin: "5%",
    width: 300,
    height: 300,
    borderRadius: 5,
  },
  buttonClose: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "darkred",
  },
});

export { EditCellModal, AddCellModal, DeleteCellModal, ShowImageCellModal };
