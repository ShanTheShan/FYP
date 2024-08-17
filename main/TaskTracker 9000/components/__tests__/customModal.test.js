import React from "react";
import { render } from "@testing-library/react-native";
import { EditCellModal, AddCellModal, DeleteCellModal, ShowImageCellModal } from "../customModals";

describe("Modals snapshot tests in customModals", () => {
  it("should render EditCellModal correctly in light mode", () => {
    const EditCellSnapLight = render(
      <EditCellModal
        modalVisible={true}
        setModalVisible={() => {}}
        text="Test text"
        updateText={() => {}}
        textID="1"
        currentTheme="light"
      />
    ).toJSON();
    expect(EditCellSnapLight).toMatchSnapshot();
  });

  it("should render EditCellModal correctly in dark mode", () => {
    const EditCellSnapDark = render(
      <EditCellModal
        modalVisible={true}
        setModalVisible={() => {}}
        text="Test text"
        updateText={() => {}}
        textID="1"
        currentTheme="dark"
      />
    ).toJSON();
    expect(EditCellSnapDark).toMatchSnapshot();
  });

  it("should render AddCellModal correctly in light mode", () => {
    const AddCellModalLight = render(
      <AddCellModal
        modalVisible={true}
        setModalVisible={() => {}}
        createCellFn={() => {}}
        currentTheme="light"
      />
    ).toJSON();
    expect(AddCellModalLight).toMatchSnapshot();
  });

  it("should render AddCellModal correctly in dark mode", () => {
    const AddCellModalDark = render(
      <AddCellModal
        modalVisible={true}
        setModalVisible={() => {}}
        createCellFn={() => {}}
        currentTheme="dark"
      />
    ).toJSON();
    expect(AddCellModalDark).toMatchSnapshot();
  });

  it("should render DeleteCellModal correctly in light mode", () => {
    const DeleteCellModalLight = render(
      <DeleteCellModal
        modalVisible={true}
        setModalVisible={() => {}}
        deleteFn={() => {}}
        toDelete="item"
        currentTheme="light"
        text="item"
      />
    ).toJSON();
    expect(DeleteCellModalLight).toMatchSnapshot();
  });

  it("should render DeleteCellModal correctly in dark mode", () => {
    const DeleteCellModalDark = render(
      <DeleteCellModal
        modalVisible={true}
        setModalVisible={() => {}}
        deleteFn={() => {}}
        toDelete="item"
        currentTheme="dark"
        text="item"
      />
    ).toJSON();
    expect(DeleteCellModalDark).toMatchSnapshot();
  });

  it("should render ShowImageCellModal correctly in light mode", () => {
    const ShowImageCellModalLight = render(
      <ShowImageCellModal
        modalVisible={true}
        setModalVisible={() => {}}
        currentTheme="light"
        image={require("../../assets/tutorial_notes.jpg")}
      />
    ).toJSON();
    expect(ShowImageCellModalLight).toMatchSnapshot();
  });

  it("should render ShowImageCellModal correctly in dark mode", () => {
    const ShowImageCellModalDark = render(
      <ShowImageCellModal
        modalVisible={true}
        setModalVisible={() => {}}
        currentTheme="dark"
        image={require("../../assets/tutorial_notes.jpg")}
      />
    ).toJSON();
    expect(ShowImageCellModalDark).toMatchSnapshot();
  });
});
