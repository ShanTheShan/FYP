import { React } from "react";
import CustomNavigator from "./navigation/Navigation";
import { ThemeStateProvider } from "./context/themeContext";
import { AnimationStateProvider } from "./context/animationContext";
import { TimerPresetStateProvider } from "./context/timerContext";

export default function App() {
  return (
    //wrap the global theme state around our entire stack, so we know what theme is currently chosen by the user
    <ThemeStateProvider>
      <AnimationStateProvider>
        <TimerPresetStateProvider>
          <CustomNavigator />
        </TimerPresetStateProvider>
      </AnimationStateProvider>
    </ThemeStateProvider>
  );
}
