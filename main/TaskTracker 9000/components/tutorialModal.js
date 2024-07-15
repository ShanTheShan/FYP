import { React } from "react";
import { StyleSheet, Text, View, Modal, Pressable } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { CarouselItem } from "../components/customCarousel";
import { tutorialImages } from "../constants/carouImages";

export const TutorialModal = ({ modalVisible, setModalVisible }) => {
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
            renderItem={({ index, item }) => <CarouselItem key={index} item={item} />}
          />
          <Pressable style={styles.modalButton} onPress={() => setModalVisible(!modalVisible)}>
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
    height: "90%",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
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
