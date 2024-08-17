import { View } from "react-native";

export const Circle = (props) => {
  return (
    <View
      testID="circle"
      style={{
        width: 25,
        height: 25,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: props.theme === "dark" ? "white" : "black",
      }}
    />
  );
};
