import { StyleSheet } from "react-native";

export const taskCreationScreenStyles = StyleSheet.create({
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
  image: {
    width: 30,
    height: 30,
  },
  containerDark: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: "5%",
    backgroundColor: "#1C1C1C",
  },
  containerLight: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: "5%",
    backgroundColor: "#FFFFFF",
  },

  textInputDark: {
    height: 50,
    width: "90%",
    borderWidth: 2,
    marginTop: 20,
    paddingLeft: 10,
    backgroundColor: "lightgrey",
  },
  textInputLight: {
    height: 40,
    width: "90%",
    borderWidth: 2,
    marginTop: 20,
    paddingLeft: 10,
  },
  bulletsDark: {
    flexDirection: "column",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  bulletsLight: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  bulletTextDark: {
    fontSize: 20,
    paddingLeft: 10,
    color: "white",
  },
  bulletTextLight: {
    fontSize: 20,
    paddingLeft: 10,
    color: "black",
  },
  dateTimeView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    //marginLeft: "5%",
  },
  dateDark: {
    fontSize: 16,
    color: "white",
  },
  dateLight: {
    fontSize: 10,
    color: "black",
  },
  timeDark: {
    fontSize: 16,
    color: "white",
    paddingLeft: 10,
  },
  timeLight: {
    fontSize: 10,
    color: "black",
  },
  timeTouchableDark: {
    backgroundColor: "lightgrey",
    fontSize: 15,
    borderRadius: 5,
    padding: 3,
    marginLeft: 10,
  },
  timeTouchableLight: {},
  submitButton: {
    backgroundColor: "green",
    padding: 10,
    margin: 15,
    height: 40,
    width: 80,
    borderRadius: 10,
    marginBottom: "30%",
  },
});
