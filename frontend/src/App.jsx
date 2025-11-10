import React, { useState, useRef } from "react";

/**
 * App.jsx
 * - Connected to real FastAPI backend
 * - Uses Tailwind CSS for a clean, professional UI
 * - Created by SRINIVAS BAYYA
 */

const IconUpload = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 15v2a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Navbar({ darkMode, setDarkMode }) {
  return (
    <header
      className={`w-full px-6 py-3 flex items-center justify-between ${
        darkMode ? "bg-slate-800/60" : "bg-white/70"
      } backdrop-blur-sm shadow-sm`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
          SE
        </div>
        <h1
          className={`text-lg font-semibold ${
            darkMode ? "text-slate-100" : "text-slate-900"
          }`}
        >
          summarizeeasy.ai
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-slate-500 hidden md:block">Smart Summarizer</div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
            darkMode
              ? "border-slate-700 bg-slate-700/60 text-white"
              : "border-slate-200 bg-white text-slate-800"
          }`}
        >
          <span className="text-sm">{darkMode ? "Dark" : "Light"}</span>
        </button>
      </div>
    </header>
  );
}

function UploadCard({
  darkMode,
  file,
  setFile,
  language,
  setLanguage,
  summaryType,
  setSummaryType,
  onGenerate,
  loading,
}) {
  const fileInputRef = useRef(null);
  const [dragHover, setDragHover] = useState(false);

  const handleFiles = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    setFile(selectedFiles[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragHover(false);
    const dt = e.dataTransfer;
    if (dt && dt.files) handleFiles(dt.files);
  };

  return (
    <div
      className={`rounded-2xl p-6 w-full max-w-md ${
        darkMode
          ? "bg-slate-800/50 border border-slate-700"
          : "bg-white/60 border border-slate-100"
      } backdrop-blur-md shadow-lg`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <IconUpload className="w-5 h-5" />
        </div>
        <h2
          className={`text-lg font-semibold ${
            darkMode ? "text-slate-100" : "text-slate-900"
          }`}
        >
          Upload & Customize
        </h2>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragHover(true);
        }}
        onDragLeave={() => setDragHover(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current.click()}
        className={`border-2 ${
          dragHover ? "border-blue-400 bg-blue-50/40" : "border-dashed border-slate-200"
        } rounded-xl p-4 mb-4 cursor-pointer transition-colors`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              darkMode ? "bg-slate-700/40" : "bg-slate-100"
            }`}
          >
            <IconUpload />
          </div>
          <div>
            <div
              className={`${
                darkMode ? "text-slate-200" : "text-slate-700"
              } font-medium`}
            >
              {file ? file.name : "Drag & Drop PDF/Image or Click to Browse"}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Supported: .pdf, .png, .jpg, .jpeg (max 10MB)
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span
            className={`text-sm mb-2 ${
              darkMode ? "text-slate-200" : "text-slate-700"
            }`}
          >
            Language
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-transparent outline-none"
          >
            <option>English</option>
            <option>Telugu</option>
            <option>Hindi</option>
          </select>
        </label>

        <label className="flex flex-col">
          <span
            className={`text-sm mb-2 ${
              darkMode ? "text-slate-200" : "text-slate-700"
            }`}
          >
            Format
          </span>
          <select
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-transparent outline-none"
          >
            <option>Short</option>
            <option>Medium</option>
            <option>Long</option>
            <option>Bullet Points</option>
          </select>
        </label>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || !file}
        className={`w-full py-3 rounded-full font-semibold shadow-md ${
          loading ? "opacity-70" : ""
        }`}
        style={{
          background: "linear-gradient(90deg,#FF7A00 0%, #FF5A3C 100%)",
          color: "white",
        }}
      >
        {loading ? "Generating..." : "Generate Summary"}
      </button>
    </div>
  );
}

function SummaryCard({ darkMode, summary, loading }) {
  return (
    <div
      className={`rounded-2xl p-6 w-full max-w-2xl ${
        darkMode
          ? "bg-slate-800/50 border border-slate-700"
          : "bg-white/60 border border-slate-100"
      } backdrop-blur-md shadow-lg`}
    >
      <h2
        className={`text-lg font-semibold mb-4 ${
          darkMode ? "text-slate-100" : "text-slate-900"
        }`}
      >
        Your AI Summary
      </h2>
      <div
        className={`rounded-lg p-4 min-h-[240px] ${
          darkMode ? "bg-slate-900/40" : "bg-white"
        } border ${darkMode ? "border-slate-700" : "border-slate-100"} overflow-auto`}
      >
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        ) : summary ? (
          <pre
            className={`whitespace-pre-wrap ${
              darkMode ? "text-slate-100" : "text-slate-800"
            }`}
          >
            {summary}
          </pre>
        ) : (
          <div className="text-slate-400 text-center">
            Upload a document and click “Generate Summary”.
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("English");
  const [summaryType, setSummaryType] = useState("Long");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Real Backend Function
  async function handleGenerateSummary() {
    if (!file) return;

    setLoading(true);
    setSummary("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("length", summaryType.toLowerCase());

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate summary.");
      }

      const data = await response.json();
      const formatted = `📘 Summary\n${data.summary}\n\n⭐ Highlights\n${data.highlights
        .map((h) => `- ${h}`)
        .join("\n")}\n\n💡 Suggestions\n${data.improvement_suggestions
        .map((s, i) => `${i + 1}. ${s}`)
        .join("\n")}`;

      setSummary(formatted);
    } catch (err) {
      setSummary(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-b from-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-b from-blue-50 to-white text-slate-900"
      } min-h-screen`}
    >
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="p-8 md:p-12">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <UploadCard
            darkMode={darkMode}
            file={file}
            setFile={setFile}
            language={language}
            setLanguage={setLanguage}
            summaryType={summaryType}
            setSummaryType={setSummaryType}
            onGenerate={handleGenerateSummary} // ✅ Connected here
            loading={loading}
          />
          <SummaryCard darkMode={darkMode} summary={summary} loading={loading} />
        </div>
        <footer className="max-w-screen-xl mx-auto mt-8 text-center text-xs text-slate-400">
          Made with ❤️ by SRINIVASBAYYA
        </footer>
      </main>
    </div>
  );
}
