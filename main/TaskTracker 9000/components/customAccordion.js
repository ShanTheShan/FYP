import React from "react";
import { StyleSheet, View, ScrollView, TouchableHighlight, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

export function AccordionItem({ isExpanded, viewKey, children, style, duration = 200 }) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded), {
      duration,
    })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));
  return (
    <Animated.View key={`accordionItem_${viewKey}`} style={[styles.animatedView, bodyStyle, style]}>
      <View
        onLayout={(e) => {
          height.value = Math.round(e.nativeEvent.layout.height);
        }}
        style={styles.wrapper}
      >
        {children}
      </View>
    </Animated.View>
  );
}

/**
 * Function to render the React Components
 * inside the Accordion Animated View.
 *
 * @param {*} content Your React Components passed will be children of ScrollView
 * @param {number} scrollHeight Set the scroll view displayed height manually for each accordion
 */
export function Item({ content, scrollHeight, currentTheme }) {
  return (
    <ScrollView
      style={[
        styles.scrollView,
        currentTheme === "dark" ? { backgroundColor: "#1C1C1C" } : { backgroundColor: "white" },
        { maxHeight: scrollHeight },
      ]}
    >
      {content}
    </ScrollView>
  );
}

export function Parent({ isOpen, AccordionComponent, ItemComponent, uniqueKey }) {
  return (
    <View style={styles.parent}>
      <AccordionComponent isExpanded={isOpen} viewKey={uniqueKey}>
        <ItemComponent />
      </AccordionComponent>
    </View>
  );
}

export function AccordionTouchable({ onPress, currentTheme, text }) {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(progress.value, [0, 1], ["#2B2B2B", "#1A119E"]),
    };
  });

  return (
    <TouchableHighlight
      onPress={() => {
        onPress(), (progress.value = withTiming(1 - progress.value, { duration: 200 }));
      }}
      style={styles.buttonStyling}
    >
      <Animated.View style={[styles.animatedWrapper, animatedStyle]}>
        <Text
          style={
            currentTheme === "dark"
              ? { color: "white", fontSize: 15, paddingVertical: 3, paddingRight: 5 }
              : { color: "black", fontSize: 15, paddingVertical: 3 }
          }
        >
          {text}
        </Text>
      </Animated.View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "absolute",
  },
  animatedView: {
    width: "100%",
    overflow: "hidden",
  },
  parent: {
    width: "100%",
    alignItems: "center",
  },
  scrollView: {
    backgroundColor: "#FFFFFF",
  },
  buttonStyling: {
    width: "100%",
  },
  animatedWrapper: {
    backgroundColor: "#2B2B2B",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
