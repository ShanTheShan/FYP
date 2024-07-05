import { StyleSheet } from "react-native";

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  safeArea: {
    flex: 1,
    height: "100%",
  },
  scrollViewLight: {
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  scrollViewDark: {
    height: "100%",
    backgroundColor: "#1C1C1C",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    elevation: 2,
    backgroundColor: "darkgreen",
  },
  buttonClose: {
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    elevation: 2,
    backgroundColor: "darkred",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  createProjectModalDarkView: {
    backgroundColor: "#1F1F1F",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 10,
  },
  createProjectModalLightView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 10,
  },
  textInputDark: {
    borderColor: "white",
    color: "white",
    height: 40,
    width: 155,
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 10,
    paddingLeft: 5,
  },
  textInputLight: {
    borderColor: "black",
    height: 40,
    width: 155,
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 10,
    paddingLeft: 5,
  },
});
