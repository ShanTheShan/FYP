import React from "react";
import { StyleSheet, Button, Text, TouchableOpacity, Dimensions } from "react-native";

//for responsive absolute positioning
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SmallButton = ({ title, color, press }) => {
  return <Button onPress={press} title={title} color={color} style={styles.small} />;
};

const AddButton = ({ press }) => {
  return (
    <TouchableOpacity onPress={press} style={styles.addButton}>
      <Text style={{ color: "white", fontSize: 30 }}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    alignItems: "center",
    backgroundColor: "darkgreen",
    borderRadius: 10,
    position: "absolute",
    bottom: windowHeight - (windowHeight - 20),
    width: 50,
    height: 50,
    right: 20,
  },
});

export { SmallButton, AddButton };
