import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel from "react-native-reanimated-carousel";
import { CarouselItem } from "../components/customCarousel";
import { tutorialImages } from "../constants/carouImages";

export const TutorialModal = ({ modalVisible, setModalVisible }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);

  const closeTutorial = async () => {
    try {
      await AsyncStorage.setItem("viewed", "true");
      setModalVisible(!modalVisible);
    } catch (error) {
      console.log("closeTutorial() :", error);
    }
  };

  //carousel size must the size of the view, which is responsive, therefore cant be fixed values
  // const onLayout = (event) => {
  //   const { _, width } = event.nativeEvent.layout;
  //   if (carouselWidth != 0 || carouselWidth != NaN || carouselWidth != null) {
  //     setCarouselWidth(Math.floor(width));
  //   }
  // };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.tutorialContainer}>
        <View style={styles.tutorialView}>
          <View style={styles.carouselView}>
            <Carousel
              loop={false}
              width={300}
              autoPlay={false}
              data={tutorialImages}
              onProgressChange={(_, absoluteProgress) => {
                setCurrentIndex(Math.round(absoluteProgress));
              }}
              renderItem={({ index, item }) => <CarouselItem key={index} item={item} />}
            />
          </View>
          <View style={styles.paginationParentView}>
            <View style={styles.paginationChildView}>
              {tutorialImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={styles.buttonView}>
            <Pressable style={styles.modalButton} onPress={closeTutorial}>
              <Text>DONE</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tutorialContainer: {
    flex: 1,
    padding: "10%",
    backgroundColor: "#323232",
  },
  tutorialView: {
    flex: 1,
  },
  carouselView: {
    flex: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationParentView: {
    flex: 0.5,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  paginationChildView: {
    flexDirection: "row",
  },
  buttonView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "darkgreen",
  },
});
