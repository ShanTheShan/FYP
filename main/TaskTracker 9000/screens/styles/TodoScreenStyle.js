import { StyleSheet } from "react-native";

export const todoScreenStyles = StyleSheet.create({
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
  calendarThemeDark: {
    backgroundColor: "black",
    calendarBackground: "black",
    textSectionTitleColor: "white",
    dayTextColor: "white",
    textDisabledColor: "grey",
    monthTextColor: "white",
  },
  calendarThemeLight: {
    backgroundColor: "white",
    textSectionTitleColor: "black",
  },
  modalDarkView: {
    backgroundColor: "#1F1F1F",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 10,
  },
  modalLightView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 10,
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
  textInputDark: {
    borderColor: "white",
    color: "white",
    height: 45,
    width: 190,
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 10,
    paddingLeft: 5,
  },
  textInputLight: {
    height: 45,
    width: 190,
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 10,
    paddingLeft: 5,
  },
  buttonEnter: {
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
});
