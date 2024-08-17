import { renderHook } from "@testing-library/react-hooks";
import { useContext } from "react";
import useHeaderBackground from "../headerBackground";

jest.mock("@react-native-async-storage/async-storage", () => ({}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

describe("useHeaderBackground() custom hook test", () => {
  it("returns correct Navigation Header background color for dark theme", () => {
    useContext.mockReturnValue({ currentTheme: "dark" });

    const { result } = renderHook(() => useHeaderBackground());

    expect(result.current).toBe("#2B2B2B");
  });

  it("returns correct Navigation Header background color for light theme", () => {
    useContext.mockReturnValue({ currentTheme: "light" });

    const { result } = renderHook(() => useHeaderBackground());
    expect(result.current).toBe("#FFFFFF");
  });
});
