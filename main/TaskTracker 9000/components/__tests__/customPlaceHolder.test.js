import { render } from "@testing-library/react-native";
import { MyPlaceHolder } from "../customPlaceHolder";

describe("MyPlaceHolder Component in customPlaceholder", () => {
  it("should render with correct text with dark theme", () => {
    const { getByText } = render(<MyPlaceHolder value="dummy" currentTheme="light" />);
    const text = getByText("You currently have no dummy...");
    expect(text).toBeTruthy();
  });

  it("should render with correct text with light theme", () => {
    const { getByText } = render(<MyPlaceHolder value="practise" currentTheme="dark" />);
    const text = getByText("You currently have no practise...");
    expect(text).toBeTruthy();
  });
});
