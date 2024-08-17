import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SmallButton, AddButton, FloatingActionButton, ProjectDetailsAdd } from "../customButtons";
import { useSharedValue } from "react-native-reanimated";

describe("SmallButton customButton test", () => {
  it("should render with correct title and color", () => {
    const { getByTestId } = render(<SmallButton title="Dummy" color="green" press={() => {}} />);
    const button = getByTestId("smallbutton");
    expect(button.props.style[1].backgroundColor).toBe("green");
  });

  it("should calls the press function when pressed", () => {
    const mockPress = jest.fn();
    const { getByTestId } = render(<SmallButton title="Dummy" color="green" press={mockPress} />);
    const button = getByTestId("smallbutton");
    fireEvent.press(button);
    expect(mockPress).toHaveBeenCalled();
  });
  it("should match snapshot", () => {
    const snap = render(<SmallButton title="Dummy" color="green" press={() => {}} />).toJSON();
    expect(snap).toMatchSnapshot();
  });
});

describe("AddButton customButton test", () => {
  it("should render the plus icon", () => {
    const { getByText } = render(<AddButton press={() => {}} />);
    const buttonText = getByText("+");
    expect(buttonText).toBeTruthy();
  });

  it("should call the press function when pressed", () => {
    const mockPress = jest.fn();
    const { getByText } = render(<AddButton press={mockPress} />);
    const button = getByText("+");
    fireEvent.press(button);
    expect(mockPress).toHaveBeenCalled();
  });
  it("should match snapshot", () => {
    const snap = render(<AddButton press={() => {}} />).toJSON();
    expect(snap).toMatchSnapshot();
  });
});

describe("FloatingActionButton customButton test", () => {
  it("should render the plus icon", () => {
    const mockIsExpanded = { value: false };
    const { getByText } = render(
      <FloatingActionButton
        isExpanded={mockIsExpanded}
        index={1}
        buttonLetter="+"
        customPress={() => {}}
        handlePress={() => {}}
      />
    );
    const buttonText = getByText("+");
    expect(buttonText).toBeTruthy();
  });

  it("should call customPress and handlePress when pressed", () => {
    const mockIsExpanded = { value: false };
    const mockCustomPress = jest.fn();
    const mockHandlePress = jest.fn();
    const { getByText } = render(
      <FloatingActionButton
        isExpanded={mockIsExpanded}
        index={1}
        buttonLetter="+"
        customPress={mockCustomPress}
        handlePress={mockHandlePress}
      />
    );
    const button = getByText("+");
    fireEvent.press(button);
    expect(mockCustomPress).toHaveBeenCalled();
    expect(mockHandlePress).toHaveBeenCalled();
  });
  it("should match snapshot", () => {
    const mockIsExpanded = { value: false };
    const snap = render(
      <FloatingActionButton
        isExpanded={mockIsExpanded}
        index={1}
        buttonLetter="+"
        customPress={() => {}}
        handlePress={() => {}}
      />
    ).toJSON();
    expect(snap).toMatchSnapshot();
  });
});

describe("ProjectDetailsAdd customButton test", () => {
  it("should render the plus icon", () => {
    const mockIsExpanded = { value: false };
    const { getByText } = render(
      <ProjectDetailsAdd isExpanded={mockIsExpanded} handlePress={() => {}} />
    );
    const plusIcon = getByText("+");
    expect(plusIcon).toBeTruthy();
  });

  it("should call handlePress when pressed", () => {
    const mockIsExpanded = { value: false };
    const mockHandlePress = jest.fn();
    const { getByText } = render(
      <ProjectDetailsAdd isExpanded={mockIsExpanded} handlePress={mockHandlePress} />
    );
    const button = getByText("+");
    fireEvent.press(button);
    expect(mockHandlePress).toHaveBeenCalled();
  });
  it("should match snapshot", () => {
    const mockIsExpanded = { value: false };
    const snap = render(
      <ProjectDetailsAdd isExpanded={mockIsExpanded} handlePress={() => {}} />
    ).toJSON();
    expect(snap).toMatchSnapshot();
  });
});
