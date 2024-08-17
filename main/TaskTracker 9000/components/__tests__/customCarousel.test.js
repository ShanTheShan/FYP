import React from "react";
import { render } from "@testing-library/react-native";
import { CarouselItem } from "../customCarousel";

describe("CarouselItem Component test", () => {
  const mockItem = {
    title: "This is homescreen tutorial dummy text.",
    img: require("../../assets/tutorial_homescreen.jpg"),
  };

  it("should render the component correctly", () => {
    const { getByText, getByTestId } = render(<CarouselItem item={mockItem} />);

    expect(getByText("This is homescreen tutorial dummy text.")).toBeTruthy();

    const image = getByTestId("carousel-image");
    expect(image.props.source).toEqual(mockItem.img);
  });

  it("should display the correct image", () => {
    const { getByTestId } = render(<CarouselItem item={mockItem} />);
    const image = getByTestId("carousel-image");
    expect(image.props.source).toEqual(mockItem.img);
  });

  it("should display the correct text", () => {
    const { getByText } = render(<CarouselItem item={mockItem} />);
    expect(getByText("This is homescreen tutorial dummy text.")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const snap = render(<CarouselItem item={mockItem} />).toJSON();
    expect(snap).toMatchSnapshot();
  });
});
