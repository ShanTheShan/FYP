import { useContext, useEffect, useState } from "react";
import { themeContext } from "../context/themeContext";

//to display the relevant header background theme
const useHeaderBackground = () => {
  //global theme state
  const { currentTheme } = useContext(themeContext);
  const [headerBackground, setHeaderBackground] = useState("#2B2B2B");

  //load theme on stack render
  useEffect(() => {
    if (currentTheme === "dark") {
      setHeaderBackground("#2B2B2B");
    } else if (currentTheme === "light") {
      setHeaderBackground("#FFFFFF");
    } else {
      //default will always be dark
      setHeaderBackground("#2B2B2B");
    }
  }, [currentTheme]);

  return headerBackground;
};

const useHeaderTitleColor = () => {
  //global theme state
  const { currentTheme } = useContext(themeContext);
  const [headerBackground, setHeaderBackground] = useState("#2B2B2B");

  //load theme on stack render
  useEffect(() => {
    if (currentTheme === "dark") {
      setHeaderBackground("#2B2B2B");
    } else if (currentTheme === "light") {
      setHeaderBackground("#FFFFFF");
    } else {
      //default will always be dark
      setHeaderBackground("#2B2B2B");
    }
  }, [currentTheme]);

  return headerBackground;
};

export default useHeaderBackground;
