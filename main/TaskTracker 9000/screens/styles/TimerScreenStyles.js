import { StyleSheet } from "react-native";

export const timerScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  timerViewDark: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C1C1C",
  },
  timerViewLight: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  digitsLight: {
    fontSize: 40,
    color: "black",
  },
  digitsDark: {
    fontSize: 40,
    color: "white",
  },
  startButton: {
    backgroundColor: "green",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "red",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  infoModalDarkView: {
    backgroundColor: "#1F1F1F",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 10,
  },
  infoModalLightView: {
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
