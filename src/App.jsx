import React, { useEffect, useMemo, useState } from "react";

const VERSES = [
  {
    ref: "1 Peter 5:7",
    text: "Cast all your anxiety on Him because He cares for you.",
    meaning: "God invites you to hand over your worries—He cares and will help.",
    apply: "Name one worry, pray: 'God, I give this to You,' then take one small step you can control.",
  },
  {
    ref: "Philippians 4:6-7",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    meaning: "Trade panic for prayer and gratitude; God's peace guards your heart and mind.",
    apply: "List 3 things you’re thankful for, and one request. Hand it to God today.",
  },
  {
    ref: "Isaiah 41:10",
    text: "Do not fear, for I am with you; do not be dismayed, for I am your God.",
    meaning: "You’re not alone—God’s presence gives strength and peace.",
    apply: "When stress rises, whisper: 'You are with me.' Then take the next small right step.",
  },
  {
    ref: "Proverbs 3:5-6",
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to Him, and He will make your paths straight.",
    meaning: "Even when things don’t make sense, trust that God’s leading you right.",
    apply: "Before a decision, pause and say: 'God, guide me.'",
  },
];

function getVerseIndexForDate(d = new Date()) {
  const seed = d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
  return seed % VERSES.length;
}

export default function App() {
  const verse = useMemo(() => VERSES[getVerseIndexForDate(new Date())], []);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.style.background = theme === "dark" ? "#0f172a" : "#f8fafc";
    document.body.style.color = theme === "dark" ? "#f8fafc" : "#0f172a";
  }, [theme]);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: "20px" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>📖 Daily Bible Verse</h1>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        style={{ marginTop: 10, padding: "6px 12px", borderRadius: 8 }}>
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>

      <div style={{ marginTop: 30, padding: 20, borderRadius: 15, background: theme === "light" ? "#fff" : "#1e293b", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{verse.ref}</p>
        <p style={{ fontSize: "1.1rem", marginBottom: 15 }}>“{verse.text}”</p>
        <p><strong>Simple meaning:</strong> {verse.meaning}</p>
        <p><strong>How to apply it today:</strong> {verse.apply}</p>
      </div>

      <footer style={{ marginTop: 30, fontSize: "0.8rem", textAlign: "center", opacity: 0.7 }}>
        Built by Henry ✝️
      </footer>
    </div>
  );
}
