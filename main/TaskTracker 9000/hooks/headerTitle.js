import { useContext, useEffect, useState } from "react";
import { themeContext } from "../context/themeContext";

//to display the relevant header background theme
const useHeaderTitle = () => {
  //global theme state
  const { currentTheme } = useContext(themeContext);
  const [headerTitleColor, setHeaderTitleColor] = useState("#FFFFFF");

  //load theme on stack render
  useEffect(() => {
    if (currentTheme === "dark") {
      setHeaderTitleColor("#FFFFFF");
    } else if (currentTheme === "light") {
      setHeaderTitleColor("#2B2B2B");
    } else {
      //default will always be white title against dark mode
      setHeaderTitleColor("#FFFFFF");
    }
  }, [currentTheme]);

  return headerTitleColor;
};

export default useHeaderTitle;
