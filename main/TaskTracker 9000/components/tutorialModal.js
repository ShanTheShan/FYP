import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel from "react-native-reanimated-carousel";
import { CarouselItem } from "../components/customCarousel";
import { tutorialImages } from "../constants/carouImages";

export const TutorialModal = ({ modalVisible, setModalVisible }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const closeTutorial = async () => {
    try {
      await AsyncStorage.setItem("viewed", "true");
      setModalVisible(!modalVisible);
    } catch (error) {
      console.log("closeTutorial() :", error);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.tutorialContainer}>
        <View style={styles.tutorialView}>
          <Carousel
            loop={false}
            width={300}
            height={500}
            autoPlay={false}
            data={tutorialImages}
            onProgressChange={(_, absoluteProgress) => {
              setCurrentIndex(Math.round(absoluteProgress));
            }}
            renderItem={({ index, item }) => <CarouselItem key={index} item={item} />}
          />
          <View style={styles.pagination}>
            {tutorialImages.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index ? styles.activeDot : styles.inactiveDot]}
              />
            ))}
          </View>
          <Pressable style={styles.modalButton} onPress={closeTutorial}>
            <Text>OKAY</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tutorialContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#323232",
  },
  tutorialView: {
    height: "85%",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    marginBottom: "10%",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "white",
  },
  inactiveDot: {
    backgroundColor: "gray",
  },
  modalButton: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 50,
    elevation: 2,
    backgroundColor: "darkgreen",
  },
});
