import { useContext } from "react";
import { Text } from "react-native";
import { render, screen } from "@testing-library/react-native";
import { timerContext, TimerPresetStateProvider } from "../timerContext";

const TimerComponentMock = () => {
  const { workDuration, restDuration } = useContext(timerContext);
  return (
    <>
      <Text testID="work-duration">{workDuration}</Text>
      <Text testID="rest-duration">{restDuration}</Text>
    </>
  );
};

describe("TimerPresetStateProvider() global context test", () => {
  it("returns the default work and rest durations, 52 mins 17 mins", () => {
    render(
      <TimerPresetStateProvider>
        <TimerComponentMock />
      </TimerPresetStateProvider>
    );

    const workDuration = screen.getByTestId("work-duration");
    const restDuration = screen.getByTestId("rest-duration");

    // Verify that the default values are provided
    expect(workDuration.props.children).toBe(3120);
    expect(restDuration.props.children).toBe(1020);
  });
});
