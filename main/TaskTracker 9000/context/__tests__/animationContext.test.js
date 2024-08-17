import { useContext } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { animationContext, AnimationStateProvider } from "../animationContext";

describe("AnimationStateProvider() global context test", () => {
  it("should provide the initial value and update the toggleValidator state", () => {
    const wrapper = ({ children }) => <AnimationStateProvider>{children}</AnimationStateProvider>;

    const { result } = renderHook(() => useContext(animationContext), {
      wrapper,
    });

    expect(result.current.toggleValidator).toBe(false);
    act(() => {
      result.current.setToggleValidator(true);
    });
    expect(result.current.toggleValidator).toBe(true);
  });

  it("should provide the initial value and update the toggleActionDone state", () => {
    const wrapper = ({ children }) => <AnimationStateProvider>{children}</AnimationStateProvider>;

    const { result } = renderHook(() => useContext(animationContext), {
      wrapper,
    });

    expect(result.current.toggleActionDone).toBe(false);
    act(() => {
      result.current.setToggleActionDone(true);
    });
    expect(result.current.toggleActionDone).toBe(true);
  });

  it("should provide the initial value and update the toggleReminderValidator state", () => {
    const wrapper = ({ children }) => <AnimationStateProvider>{children}</AnimationStateProvider>;

    const { result } = renderHook(() => useContext(animationContext), {
      wrapper,
    });

    expect(result.current.toggleReminderValidator).toBe(false);
    act(() => {
      result.current.setReminderValidator(true);
    });
    expect(result.current.toggleReminderValidator).toBe(true);
  });
});
