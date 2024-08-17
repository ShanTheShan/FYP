import { useContext } from "react";
import { renderHook } from "@testing-library/react-hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themeContext, ThemeStateProvider } from "../themeContext";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

describe("ThemeStateProvider() global context test", () => {
  it("should set initial theme to 'dark'", () => {
    const wrapper = ({ children }) => <ThemeStateProvider>{children}</ThemeStateProvider>;

    const { result } = renderHook(() => useContext(themeContext), {
      wrapper,
    });
    expect(result.current.currentTheme).toBe("dark");
  });

  it("should set theme to 'light' if AsyncStorage returns 'true' for 'light'", async () => {
    AsyncStorage.getItem.mockResolvedValue("true");

    const wrapper = ({ children }) => <ThemeStateProvider>{children}</ThemeStateProvider>;

    const { result, waitForNextUpdate } = renderHook(() => useContext(themeContext), {
      wrapper,
    });
    await waitForNextUpdate();
    expect(result.current.currentTheme).toBe("light");
  });
});
