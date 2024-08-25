import { React } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { Cell } from "react-native-tableview-simple";
import Entypo from "@expo/vector-icons/Entypo";

import { projectDetailStyles } from "../screens/styles/ProjectDetailStyles";
import { Circle } from "../components/customShapes";

const DetailsCell = (props) => {
  let reformedSubTaskData = null;
  //since comments have no subtasks, check for null or undefined
  if (props.subtasks != null || props.subtasks != undefined) {
    reformedSubTaskData = props.subtasks;
  } else {
    reformedSubTaskData = [];
  }

  const deadlineSplitted = props.deadline.split("|");
  let reformedDeadlineData = null;

  if (deadlineSplitted[1] == " null") {
    reformedDeadlineData = deadlineSplitted[0];
  } else {
    reformedDeadlineData = deadlineSplitted;
  }

  const taskImage = props.customImage;

  return (
    <Cell
      key={props.key}
      onPress={props.action}
      isDisabled={true}
      backgroundColor={props.theme === "dark" ? "#141414" : "#F6F6F6"}
      titleTextColor={props.textColor}
      {...props}
      cellContentView={
        <TouchableOpacity onLongPress={props.handleRemoveTask}>
          <View style={{ paddingLeft: 5, paddingVertical: 5 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {props.completed ? null : (
                <TouchableOpacity onPress={props.customPress}>
                  <Circle theme={props.theme} />
                </TouchableOpacity>
              )}

              <Text
                style={[
                  { fontSize: 20, paddingBottom: 5, paddingHorizontal: 10 },
                  { color: props.textColor },
                ]}
              >
                {props.tasks}
              </Text>
              {props.reminder != null ? (
                <Entypo name="bell" size={12} color={props.theme === "dark" ? "white" : "black"} />
              ) : null}
            </View>
            <View style={{ paddingLeft: 25 }}>
              {props.deadline != "null | null" ? (
                <Text style={[{ fontSize: 15, paddingLeft: 10 }, { color: props.textColor }]}>
                  {reformedDeadlineData}
                </Text>
              ) : null}
              {reformedSubTaskData.length != 0 ? (
                <View>
                  {reformedSubTaskData.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => props.handleSubTouch(item)}
                      disabled={props.completed}
                    >
                      <Text
                        key={i}
                        style={
                          item.sub_completed === "yes"
                            ? [
                                {
                                  fontSize: 15,
                                  paddingLeft: 10,
                                  lineHeight: 20,
                                  textDecorationLine: "line-through",
                                  color: props.textColor,
                                },
                              ]
                            : { fontSize: 15, paddingLeft: 10, color: props.textColor }
                        }
                      >
                        {item.subs}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}

              {taskImage ? (
                <View>
                  <TouchableOpacity onPress={() => props.showImage({ uri: taskImage })}>
                    <Image source={{ uri: taskImage }} style={projectDetailStyles.image} />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      }
    />
  );
};

const TodoCell = (props) => (
  <TouchableOpacity
    onLongPress={() => {
      props.toggleDeleteModal(true);
      props.setToDelete(props.title);
    }}
  >
    <Cell
      backgroundColor={props.theme === "dark" ? "#141414" : "#F6F6F6"}
      {...props}
      cellContentView={
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              props.handleStrikeThrough(props.title, props.done);
            }}
          >
            <Circle theme={props.theme} />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              flexWrap: "wrap",
              fontSize: 20,
              paddingBottom: 5,
              paddingHorizontal: 10,
              color: props.textColor === "dark" ? "#FFFFFF" : "#000000",
              opacity: props.done === "yes" ? 0.5 : 1,
              textDecorationLine: props.done === "yes" ? "line-through" : "none",
            }}
          >
            {props.title}
          </Text>
          {props.reminder != null ? (
            <Entypo name="bell" size={12} color={props.theme === "dark" ? "white" : "black"} />
          ) : null}
        </View>
      }
    />
  </TouchableOpacity>
);

export { DetailsCell, TodoCell };
