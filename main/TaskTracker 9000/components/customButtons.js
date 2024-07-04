import React from "react";
import { StyleSheet, Button, Text, TouchableOpacity, Dimensions } from "react-native";

//for responsive absolute positioning
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SmallButton = ({ title, color, press }) => {
  return <Button onPress={press} title={title} color={color} style={styles.small} />;
};

const AddButton = ({ press, heightOffset }) => {
  return (
    <TouchableOpacity onPress={press} style={styles.addButton}>
      <Text style={{ color: "white", fontSize: 30 }}>+</Text>
    </TouchableOpacity>
  );
};

const DeleteButton = ({ press }) => {
  return (
    <TouchableOpacity onPress={press} style={styles.deleteButton}>
      <Text style={{ color: "white", fontSize: 20 }}>🗑️</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "darkgreen",
    borderRadius: 10,
    position: "absolute",
    bottom: windowHeight - (windowHeight - 100),
    width: 50,
    height: 50,
    right: 20,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "darkred",
    borderRadius: 10,
    position: "absolute",
    bottom: windowHeight - (windowHeight - 30),
    width: 50,
    height: 50,
    right: 20,
  },
});

export { SmallButton, AddButton, DeleteButton };
