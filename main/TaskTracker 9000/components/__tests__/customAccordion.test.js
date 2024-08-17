import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AccordionItem, Item, Parent, AccordionTouchable } from "../customAccordion";
import { Text } from "react-native";
import { useSharedValue } from "react-native-reanimated";

describe("Item Component in customAccordion", () => {
  it("should render with correct theme and content", () => {
    const { getByTestId } = render(
      <Item
        content={<Text testID="dummy_text">Dummy Content</Text>}
        scrollHeight={100}
        currentTheme="dark"
      />
    );
    const content = getByTestId("item");
    expect(content.props.style[1].backgroundColor).toBe("#1C1C1C");

    const text = getByTestId("dummy_text");
    expect(text.props.children).toBe("Dummy Content");
  });
});

describe("Parent component in customAccordion", () => {
  it("should render AccordionComponent with ItemComponent", () => {
    const { getByText } = render(
      <Parent
        isOpen={true}
        AccordionComponent={AccordionItem}
        ItemComponent={() => <Text>Item Content</Text>}
        uniqueKey="parentTest"
      />
    );
    const content = getByText("Item Content");
    expect(content).toBeTruthy();
  });
});

describe("AccordionTouchable component in customAccordion", () => {
  it("should toggle background color on press", () => {
    const { getByText } = render(
      <AccordionTouchable onPress={() => {}} currentTheme="dark" text="Dummy" />
    );
    const button = getByText("Dummy");

    fireEvent.press(button);
    expect(button).toBeTruthy();
    expect(button.props.style.color).toBe("white");
  });

  it("should match snapshot", () => {
    const snap = render(
      <AccordionTouchable onPress={() => {}} currentTheme="dark" text="Dummy" />
    ).toJSON();
    expect(snap).toMatchSnapshot();
  });
});
