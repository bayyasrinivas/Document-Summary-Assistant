import { useEffect, useState } from "react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
          📄 Document Summary Assistant
        </h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 
                     text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
        >
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
}
