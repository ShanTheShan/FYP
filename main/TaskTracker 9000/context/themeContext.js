import React from "react";
import { useState, createContext } from "react";

export const themeContext = createContext();

export const ThemeStateProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("dark");

  return (
    <themeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </themeContext.Provider>
  );
};
