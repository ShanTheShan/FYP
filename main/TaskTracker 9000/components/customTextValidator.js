import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

import { animationContext } from "../context/animationContext";

const windowHeight = Dimensions.get("window").height;

export const TextValidator = ({ value, currentTheme }) => {
  const { toggleValidator } = useContext(animationContext);
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(toggleValidator ? 1 : 0);
  }, [toggleValidator]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.textView}>
      <Animated.View style={[styles.animatedView, animatedStyle]}>
        <Text style={{ color: "white", padding: 5 }}>{value} must not be blank!</Text>
      </Animated.View>
    </View>
  );
};
export const ActionDone = ({ value, currentTheme }) => {
  const { toggleActionDone } = useContext(animationContext);
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(toggleActionDone ? 1 : 0);
  }, [toggleActionDone]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.textView}>
      <Animated.View style={[styles.animatedViewGreen, animatedStyle]}>
        <Text style={{ color: "white", padding: 5 }}>{value} added!</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: windowHeight - (windowHeight - 160),
    right: 20,
  },
  animatedView: {
    backgroundColor: "darkred",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedViewGreen: {
    backgroundColor: "darkgreen",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
