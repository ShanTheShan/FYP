import React from "react";
import { render, screen } from "@testing-library/react-native";
import { TextValidator, ReminderValidator, ActionDone } from "../customTextValidator";
import { animationContext } from "../../context/animationContext";

const mockContextValue = {
  toggleValidator: true,
  toggleReminderValidator: true,
  toggleActionDone: true,
};

const renderWithContext = (Component) => {
  return render(
    <animationContext.Provider value={mockContextValue}>
      <Component />
    </animationContext.Provider>
  );
};

describe("TextValidator component in customTextValidator", () => {
  it("should render with correct text and animation", () => {
    renderWithContext(TextValidator);
    const textElement = screen.getByText(/must not be blank!/i);
    expect(textElement).toBeTruthy();
  });
});

describe("ReminderValidator component in customTextValidator", () => {
  it("should render with correct text and animation", () => {
    renderWithContext(ReminderValidator);
    const textElement = screen.getByText(/Reminder must have a date AND time!/i);
    expect(textElement).toBeTruthy();
  });
});

describe("ActionDone component in customTextValidator", () => {
  it("should render with correct text and animation", () => {
    renderWithContext(() => <ActionDone value="Task" />);
    const textElement = screen.getByText(/Task added!/i);
    expect(textElement).toBeTruthy();
  });
});
