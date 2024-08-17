import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const MyPlaceHolder = (props) => {
  const x = props.offsetTop;
  return (
    <View
      style={[
        props.currentTheme == "dark" ? styles.placeHolderViewDark : styles.placeHolderViewLight,
        { marginTop: x },
      ]}
    >
      <Text testID="placeholder_text" style={{ color: "grey" }}>
        You currently have no {props.value}...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  placeHolderViewDark: {
    alignSelf: "center",
    backgroundColor: "#1C1C1C",
  },
  placeHolderViewLight: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
  },
});
