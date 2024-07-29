import { StyleSheet, View } from "react-native";

export const Circle = () => {
  return <View style={projectDetailStyles.circle} />;
};

export const projectDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  projecTabProgressDark: {
    backgroundColor: "#1C1C1C",
    alignItems: "center",
    justifyContent: "center",
  },
  projecTabProgressLight: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  projecNameLight: {
    fontSize: 20,
    paddingBottom: 10,
    color: "black",
  },
  projectNameDark: {
    fontSize: 20,
    paddingVertical: 10,

    color: "white",
  },
  progressPercentDark: {
    fontSize: 22,
    color: "white",
    paddingTop: 5,
  },
  progressPercentLight: {
    color: "black",
  },

  scrollViewLight: {
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  scrollViewDark: {
    height: "100%",
    backgroundColor: "#1C1C1C",
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
  },
  projecTabTasks: {
    flex: 4,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  addTaskBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "blue",
  },
  submitButton: {
    padding: 10,
    margin: 15,
    height: 40,
    width: 100,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  completedTaskView: {
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 40,
  },
  image: {
    margin: "5%",
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
  },
});
