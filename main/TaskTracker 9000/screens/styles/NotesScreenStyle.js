import { StyleSheet } from "react-native";

export const noteScreenStyles = StyleSheet.create({
  safeAreaDark: {
    flex: 1,
    height: "100%",
    backgroundColor: "#1C1C1C",
  },
  safeAreaLight: {
    flex: 1,
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  scrollViewLight: {
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  scrollViewDark: {
    height: "100%",
    backgroundColor: "#1C1C1C",
  },
  image: {
    margin: "5%",
    width: 100,
    height: 100,
    borderRadius: 5,
  },

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
