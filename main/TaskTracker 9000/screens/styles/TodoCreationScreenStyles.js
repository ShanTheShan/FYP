import { StyleSheet } from "react-native";

export const todoCreationScreenStyles = StyleSheet.create({
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
  mainContainerDark: {
    flex: 1,
    flexDirection: "column",
    marginLeft: "5%",
    backgroundColor: "#1C1C1C",
  },
  mainContainerLight: {
    flex: 1,
    flexDirection: "column",
    marginLeft: "5%",
    backgroundColor: "#FFFFFF",
  },

  textInputDark: {
    height: 50,
    width: "90%",
    borderWidth: 2,
    marginVertical: 20,
    paddingLeft: 10,
    backgroundColor: "lightgrey",
  },
  textInputLight: {
    height: 50,
    width: "90%",
    borderWidth: 2,
    marginVertical: 20,
    paddingLeft: 10,
  },
  reminderMainContainer: {
    flexDirection: "column",
    marginVertical: 15,
  },
  dateTimeView: {
    flexDirection: "row",
    marginLeft: 40,
  },
  dateDark: {
    fontSize: 16,
    color: "white",
  },
  dateLight: {
    fontSize: 16,
    color: "black",
  },
  timeDark: {
    fontSize: 16,
    color: "white",
    paddingLeft: 10,
  },
  timeLight: {
    fontSize: 16,
    color: "black",
    paddingLeft: 10,
  },
  cancelEmoji: {
    fontSize: 15,
    borderRadius: 5,
    padding: 3,
    marginLeft: 10,
  },

  timeTouchableDark: {
    backgroundColor: "lightgrey",
    fontSize: 15,
    borderRadius: 5,
    padding: 3,
    marginLeft: 10,
  },
  timeTouchableLight: {
    backgroundColor: "darkgrey",
    fontSize: 15,
    borderRadius: 5,
    padding: 3,
    marginLeft: 10,
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
  image: {
    width: 30,
    height: 30,
  },
  imagePreviewView: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 40,
    marginTop: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});
