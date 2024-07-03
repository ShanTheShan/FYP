import { useContext, useEffect, useState } from "react";
import { themeContext } from "../context/themeContext";

//to display the relevant status bar color
const useStatusBarStyle = () => {
  //global theme state
  const { currentTheme } = useContext(themeContext);
  const [statusBarColor, setStatusBarColor] = useState("#2B2B2B");
  const [statusBarTextColor, setTextBarColor] = useState("#FFFFFF");

  //load theme on stack render
  useEffect(() => {
    if (currentTheme === "dark") {
      setStatusBarColor("#2B2B2B");
      setTextBarColor("light");
    } else if (currentTheme === "light") {
      setStatusBarColor("#FFFFFF");
      setTextBarColor("dark");
    } else {
      //default will always be white title against dark mode
      setTextBarColor("light");
      setStatusBarColor("#2B2B2B");
    }
  }, [currentTheme]);

  return [statusBarColor, statusBarTextColor];
};

export default useStatusBarStyle;
