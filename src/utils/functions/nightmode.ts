"use client";
import { useState } from "react";

export default function Nightmode() {
  const [toggleDarkMode, setToggleDarkMode] = useState("darkmode");

  function toggleToDarkMode(value: string) {
    if (value === "lightmode") {
      setToggleDarkMode("darkmode");
      console.log(toggleDarkMode);
    } else {
      setToggleDarkMode("lightmode");
      console.log(toggleDarkMode);
    }
  }
}
