import React from "react";
import { useState, createContext } from "react";

export const animationContext = createContext();

export const AnimationStateProvider = ({ children }) => {
  const [toggleValidator, setToggleValidator] = useState(false);
  const [toggleActionDone, setToggleActionDone] = useState(false);

  return (
    <animationContext.Provider
      value={{ toggleValidator, setToggleValidator, toggleActionDone, setToggleActionDone }}
    >
      {children}
    </animationContext.Provider>
  );
};
