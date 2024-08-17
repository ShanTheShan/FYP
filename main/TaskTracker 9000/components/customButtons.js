import React from "react";
import { StyleSheet, Button, Text, Pressable, TouchableOpacity, Dimensions } from "react-native";
import Animated, {
  withDelay,
  interpolate,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

//for responsive absolute positioning
const windowHeight = Dimensions.get("window").height;

const SmallButton = ({ title, color, press }) => {
  return (
    <Button testID="smallbutton" onPress={press} title={title} color={color} style={styles.small} />
  );
};

const AddButton = ({ press }) => {
  return (
    <TouchableOpacity onPress={press} style={styles.addButton}>
      <Text style={{ color: "white", fontSize: 30 }}>+</Text>
    </TouchableOpacity>
  );
};

//using the react native reanimated floating action button example

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 60;

const FloatingActionButton = ({ isExpanded, index, buttonLetter, customPress, handlePress }) => {
  const animatedStyles = useAnimatedStyle(() => {
    // highlight-next-line
    const moveValue = isExpanded.value ? OFFSET * index : 0;
    const translateValue = withSpring(-moveValue, SPRING_CONFIG);
    //highlight-next-line
    const delay = index * 100;

    const scaleValue = isExpanded.value ? 1 : 0;

    return {
      transform: [
        { translateY: translateValue },
        {
          scale: withDelay(delay, withTiming(scaleValue)),
        },
      ],
    };
  });

  const multiplePressCallback = () => {
    customPress();
    handlePress();
  };

  return (
    <AnimatedTouchable
      style={[animatedStyles, floatingStyles.shadow, floatingStyles.button]}
      onPress={multiplePressCallback}
    >
      <Animated.Text style={floatingStyles.content}>{buttonLetter}</Animated.Text>
    </AnimatedTouchable>
  );
};

const ProjectDetailsAdd = ({ handlePress, isExpanded }) => {
  //function to rotate the addition symbol into a cross
  const plusIconStyle = useAnimatedStyle(() => {
    // highlight-next-line
    const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 2]);
    const translateValue = withTiming(moveValue);
    const rotateValue = isExpanded.value ? "45deg" : "0deg";

    return {
      transform: [{ translateX: translateValue }, { rotate: withTiming(rotateValue) }],
    };
  });

  return (
    <AnimatedPressable onPress={handlePress} style={mainButtonStyles.button}>
      <Animated.Text style={[plusIconStyle, mainButtonStyles.content]}>+</Animated.Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "darkgreen",
    borderRadius: 10,
    position: "absolute",
    bottom: windowHeight - (windowHeight - 100),
    width: 50,
    height: 50,
    right: 20,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "darkred",
    borderRadius: 10,
    position: "absolute",
    bottom: windowHeight - (windowHeight - 30),
    width: 50,
    height: 50,
    right: 20,
  },
});

//floating button styles
const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    borderRadius: 10,
    position: "absolute",
    width: 50,
    height: 50,
    right: 20,
    bottom: windowHeight - (windowHeight - 100),
    backgroundColor: "darkgreen",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 24,
    color: "white",
  },
});

const floatingStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    height: 45,
    backgroundColor: "darkgreen",
    position: "absolute",
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
    flexDirection: "row",
    right: 20,
    bottom: windowHeight - (windowHeight - 100),
  },
  buttonContainer: {
    alignItems: "center",
  },
  shadow: {
    elevation: 10,
  },
  content: {
    color: "white",
    fontSize: 15,
    padding: 5,
  },
});

export { SmallButton, AddButton, ProjectDetailsAdd, FloatingActionButton };
