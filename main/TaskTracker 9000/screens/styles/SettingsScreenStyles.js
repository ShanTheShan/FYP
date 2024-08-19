import { StyleSheet } from "react-native";

export const settingStyles = StyleSheet.create({
  safeAreaLight: {
    flex: 1,
    height: "100%",
  },
  safeAreaDark: {
    flex: 1,
    height: "100%",
    backgroundColor: "#1C1C1C",
  },
  navigationViewDark: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  navigationViewLight: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsContainer: {
    flex: 5,
    margin: 20,
  },
  themeModalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  themeModalView: {
    backgroundColor: "lightgrey",
    height: "30%",
    width: "75%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  timerModalView: {
    backgroundColor: "lightgrey",
    height: "45%",
    width: "70%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
    elevation: 10,
  },
  themeTextPressed: {
    marginVertical: 10,
    borderRadius: 7,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 2,
    backgroundColor: "gold",
  },
  themeTextUnpressed: {
    marginVertical: 10,
    borderRadius: 7,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 2,
    backgroundColor: "white",
  },
});
