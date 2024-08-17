import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export const CarouselItem = (props) => {
  const { item } = props;

  return (
    <View style={styles.container}>
      <Image source={item.img} style={styles.image} testID="carousel-image" />
      <Text style={styles.text}>{item.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    height: "100%",
    width: 300,
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  text: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
    padding: 5,
    textAlign: "center",
  },
});
