import { renderHook } from "@testing-library/react-hooks";
import { useContext } from "react";
import useStatusBarStyle from "../statusBar";

jest.mock("@react-native-async-storage/async-storage", () => ({}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

describe("useStatusBarStyle() custom hook test", () => {
  it("returns correct status bar & text colors for dark theme", () => {
    useContext.mockReturnValue({ currentTheme: "dark" });

    const { result } = renderHook(() => useStatusBarStyle());
    expect(result.current[0]).toBe("#2B2B2B");
    expect(result.current[1]).toBe("light");
  });

  it("returns correct status bar & text colors for light theme", () => {
    useContext.mockReturnValue({ currentTheme: "light" });

    const { result } = renderHook(() => useStatusBarStyle());
    expect(result.current[0]).toBe("#FFFFFF");
    expect(result.current[1]).toBe("dark");
  });
});
