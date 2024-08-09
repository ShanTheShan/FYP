import React from "react";
import { useState, useEffect, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const themeContext = createContext();

export const ThemeStateProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("dark");

  useEffect(() => {
    const checkThemeCache = async () => {
      try {
        const value = await AsyncStorage.getItem("light");
        if (value === "true") {
          setCurrentTheme("light");
        }
      } catch (error) {
        console.error("Error loading themeContext -> checkThemeCache():", error);
      }
    };

    checkThemeCache();
  }, []);

  return (
    <themeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </themeContext.Provider>
  );
};
