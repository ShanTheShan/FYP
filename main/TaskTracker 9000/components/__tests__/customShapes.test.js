import { render } from "@testing-library/react-native";
import { Circle } from "../customShapes";

describe("Circle Component in customShapes test", () => {
  it("should render with correct border color for dark theme", () => {
    const { getByTestId } = render(<Circle theme="dark" />);
    const circle = getByTestId("circle");
    expect(circle.props.style.borderColor).toBe("white");
  });

  it("should render with correct border color for light theme", () => {
    const { getByTestId } = render(<Circle theme="light" />);
    const circle = getByTestId("circle");
    expect(circle.props.style.borderColor).toBe("black");
  });

  it("should match snapshot", () => {
    const snap = render(<Circle theme="dark" />).toJSON();
    expect(snap).toMatchSnapshot();
  });
});
