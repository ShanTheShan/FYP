import { React } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { Cell } from "react-native-tableview-simple";

import { projectDetailStyles, Circle } from "../screens/styles/ProjectDetailStyles";

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
      backgroundColor={props.theme}
      titleTextColor={props.textColor}
      {...props}
      cellContentView={
        <View style={{ paddingLeft: 5, paddingVertical: 5 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {props.completed ? null : (
              <TouchableOpacity onPress={props.customPress}>
                <Circle />
              </TouchableOpacity>
            )}

            <Text
              style={[
                { fontSize: 20, paddingBottom: 5, paddingLeft: 10 },
                { color: props.textColor },
              ]}
            >
              {props.tasks}
            </Text>
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
                <Image source={{ uri: taskImage }} style={projectDetailStyles.image} />
              </View>
            ) : null}
          </View>
        </View>
      }
    />
  );
};

export { DetailsCell };
