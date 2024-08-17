import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DetailsCell, TodoCell } from "../customCells";

describe("DetailsCell component in customCells", () => {
  it("should render with correct content", () => {
    const { getByText, getByTestId } = render(
      <DetailsCell
        tasks="Dummy Task"
        deadline="2024-08-17 | null"
        subtasks={[{ subs: "Subtask 1", sub_completed: "no" }]}
        theme="dark"
        textColor="white"
        handleRemoveTask={() => {}}
        customPress={() => {}}
        customImage="https://example.com/image.jpg"
      />
    );

    expect(getByText("Dummy Task")).toBeTruthy();
    expect(getByText("Subtask 1")).toBeTruthy();
    expect(getByTestId("cellImage")).toBeTruthy();
  });
});

describe("TodoCell component in customCells", () => {
  it("should render with correct content", () => {
    const { getByText } = render(
      <TodoCell
        title="Todo Item"
        theme="light"
        textColor="black"
        done="no"
        handleStrikeThrough={() => {}}
        toggleDeleteModal={() => {}}
        setToDelete={() => {}}
      />
    );
    expect(getByText("Todo Item")).toBeTruthy();
  });
});
