"use client";
import { useState, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDarkState] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(function () {
    var stored = localStorage.getItem("gemcheck-theme");
    if (stored === "light") setIsDarkState(false);
    else if (stored === "dark") setIsDarkState(true);
    setLoaded(true);
  }, []);

  function setIsDark(val: boolean) {
    setIsDarkState(val);
    localStorage.setItem("gemcheck-theme", val ? "dark" : "light");
  }

  function toggleTheme() {
    setIsDark(!isDark);
  }

  return { isDark, setIsDark, toggleTheme, loaded };
}
