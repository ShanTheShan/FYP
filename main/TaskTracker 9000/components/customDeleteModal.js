import { React } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";

export const DeleteCellModal = ({
  modalVisible,
  setModalVisible,
  deleteObj,
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
          style={currentTheme === "dark" ? styles.deleteModalDarkView : styles.deleteModalLightView}
        >
          <Text style={currentTheme === "dark" ? { color: "white" } : { color: "black" }}>
            Do you want to delete this {text}?
          </Text>

          <TouchableOpacity
            style={styles.buttonEnter}
            onPress={() => {
              setModalVisible(false);
              deleteObj(toDelete);
            }}
          >
            <Text style={{ color: "white" }}>YES</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonClose}
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
});
