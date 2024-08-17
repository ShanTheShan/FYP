import { renderHook } from "@testing-library/react-hooks";
import { useContext } from "react";
import useHeaderTitle from "../headerTitle";

jest.mock("@react-native-async-storage/async-storage", () => ({}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

describe("useHeaderTitle() custom hook test", () => {
  it("returns correct Navigation Header Title color for dark theme", () => {
    useContext.mockReturnValue({ currentTheme: "dark" });

    const { result } = renderHook(() => useHeaderTitle());
    expect(result.current).toBe("#FFFFFF");
  });

  it("returns correct Navigation Header Title color for light theme", () => {
    useContext.mockReturnValue({ currentTheme: "light" });

    const { result } = renderHook(() => useHeaderTitle());
    expect(result.current).toBe("#2B2B2B");
  });
});
