import { StyleSheet } from "react-native";

export const settingStyles = StyleSheet.create({
  safeAreaLight: {
    flex: 1,
    height: "100%",
  },
  safeAreaDark: {
    flex: 1,
    height: "100%",
    backgroundColor: "#141414",
  },
  navigationView: {
    flex: 1,
    backgroundColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsContainer: {
    flex: 5,
    margin: 20,
  },
  PageTitle: {
    fontSize: 30,
    color: "black",
    paddingTop: "10%",
  },
  themeModalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  themeModalView: {
    backgroundColor: "lightgrey",
    height: "30%",
    width: "70%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  radioGroup: {
    flex: 1,
    marginVertical: "10%",
    justifyContent: "space-evenly",
    alignItems: "center",
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
