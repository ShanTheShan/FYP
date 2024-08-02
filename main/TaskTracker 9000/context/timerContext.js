import React from "react";
import { useState, createContext } from "react";

export const timerContext = createContext();

export const TimerPresetStateProvider = ({ children }) => {
  const [workDuration, setWorkDuration] = useState(3120);
  const [restDuration, setRestDuration] = useState(1020);

  return (
    <timerContext.Provider
      value={{
        workDuration,
        setWorkDuration,
        restDuration,
        setRestDuration,
      }}
    >
      {children}
    </timerContext.Provider>
  );
};
