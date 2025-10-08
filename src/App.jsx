import React, { useEffect, useMemo, useState } from "react";

// ---- Data ----------------------------------------------------
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

// ---- Helpers -------------------------------------------------
function indexForDate(d = new Date()) {
  // deterministic index based on YYYYMMDD
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return seed % VERSES.length;
}

function nextEightAM(from = new Date()) {
  const t = new Date(from);
  t.setSeconds(0, 0);
  t.setHours(8, 0, 0, 0); // 8:00 AM local
  if (t <= from) t.setDate(t.getDate() + 1); // if already past 8:00 AM today, schedule tomorrow
  return t;
}

// rotating “1-Minute Prayer” (changes wording daily)
function dailySeed(d = new Date()) {
  return (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) % 9973;
}
const PRAYER_TEMPLATES = [
  ({ v }) =>
    `Father, thank You for Your word in ${v.ref}. ${v.meaning} Teach my heart to trust You today. Guide my thoughts, steady my steps, and help me obey what You show me. In Jesus’ name, amen.`,
  ({ v }) =>
    `Lord Jesus, I receive the truth of ${v.ref}. ${v.meaning} I surrender my plans and ask for Your wisdom. Lead me in Your will and fill me with peace as I walk with You. Amen.`,
  ({ v }) =>
    `Holy Spirit, through ${v.ref} You remind me what is true. ${v.meaning} Quiet my fears, align my desires with Yours, and give me courage to act in faith today. In Jesus’ name, amen.`,
  ({ v }) =>
    `God, thank You for speaking through ${v.ref}. ${v.meaning} Help me rely on You instead of my own understanding. Order my steps and make my path straight. Amen.`,
  ({ v }) =>
    `Father, Your word in ${v.ref} is life. ${v.meaning} I place this day in Your hands—guide my decisions, guard my heart, and use me for Your purpose. In Christ’s name, amen.`,
];
function buildPrayerOfTheDay(v, d = new Date()) {
  const idx = dailySeed(d) % PRAYER_TEMPLATES.length;
  return PRAYER_TEMPLATES[idx]({ v });
}

// ---- App -----------------------------------------------------
export default function App() {
  // theme + verse index persisted
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [i, setI] = useState(() => {
    // prefer index computed from today; fall back to saved manual shuffle
    const saved = localStorage.getItem("verseIndex");
    return saved ? Number(saved) : indexForDate(new Date());
  });

  const verse = useMemo(() => VERSES[i], [i]);
  const prayer = useMemo(() => buildPrayerOfTheDay(verse, new Date()), [verse]);

  // apply theme
  useEffect(() => {
    document.body.style.background = theme === "dark" ? "#0f172a" : "#f8fafc";
    document.body.style.color = theme === "dark" ? "#f8fafc" : "#0f172a";
    localStorage.setItem("theme", theme);
  }, [theme]);

  // persist selection
  useEffect(() => {
    localStorage.setItem("verseIndex", String(i));
  }, [i]);

  // --- NEW: auto-refresh every new day + at 8:00 AM local ----
  useEffect(() => {
    // On mount, ensure the verse matches today's computed index
    setI(indexForDate(new Date()));

    // 1) Midnight/day-change watcher (checks every minute)
    const minuteTick = setInterval(() => {
      const should = indexForDate(new Date());
      setI(prev => (prev === should ? prev : should));
    }, 60 * 1000);

    // 2) Schedule a switch/refresh at next local 8:00 AM
    const schedule8am = () => {
      const now = new Date();
      const target = nextEightAM(now);
      const delay = target.getTime() - now.getTime();
      const to = setTimeout(() => {
        // set the new daily verse
        setI(indexForDate(new Date()));

        // gentle local notification if the app has permission & user enabled it
        if (localStorage.getItem("notifEnabled") === "1" && "Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification("Daily Bible Verse", {
              body: `${VERSES[indexForDate(new Date())].ref} — tap to open`,
            });
          }
        }
        // immediately schedule the next 8am
        schedule8am();
      }, delay);
      return to;
    };
    const eightTimer = schedule8am();

    return () => {
      clearInterval(minuteTick);
      clearTimeout(eightTimer);
    };
  }, []);

  // actions
  const shuffle = () => setI(Math.floor(Math.random() * VERSES.length));

  const share = async () => {
    const msg =
      `📖 ${verse.ref}\n“${verse.text}”\n\n` +
      `💡 Reflection: ${verse.meaning}\n\n` +
      `✨ Application: ${verse.apply}\n\n` +
      `🙏 1-Minute Prayer:\n${prayer}`;
    if (navigator.share) {
      try { await navigator.share({ title: verse.ref, text: msg }); } catch {}
    } else {
      await navigator.clipboard.writeText(msg);
      alert("Copied to clipboard — paste anywhere to share!");
    }
  };

  const requestNotif = async () => {
    if (!("Notification" in window)) return alert("Notifications not supported on this device.");
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return;
    localStorage.setItem("notifEnabled", "1");
    alert("Daily reminder enabled. We’ll nudge you around 8:00 AM when the verse refreshes.");
  };

  // UI
  return (
    <div style={{ maxWidth: 700, margin: "32px auto", padding: "20px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>📖 Daily Bible Verse</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} style={btn}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
        <button onClick={shuffle} style={btn}>🔀 Shuffle Verse</button>
        <button onClick={share} style={btn}>📤 Share</button>
        <button onClick={requestNotif} style={btn}>🔔 Enable Notifications</button>
      </div>

      {/* Devotional Layout */}
      <div style={card(theme)}>
        <p style={{ fontSize: 18, opacity: 0.8, marginBottom: 8 }}>God wants you to know…</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{verse.ref}</h2>
        <p style={{ fontSize: 18, marginBottom: 16 }}>“{verse.text}”</p>

        <hr style={{ opacity: 0.2, margin: "12px 0" }} />

        <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>💡 Reflection</h3>
        <p style={{ lineHeight: 1.6, marginBottom: 16 }}>{verse.meaning}</p>

        <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>✨ How you can apply it today</h3>
        <p style={{ lineHeight: 1.6 }}>{verse.apply}</p>
      </div>

      <div style={card(theme)}>
        <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>🙏 1-Minute Prayer</p>
        <p style={{ lineHeight: 1.6 }}>{prayer}</p>
      </div>

      <footer style={{ marginTop: 24, fontSize: 12, textAlign: "center", opacity: 0.7 }}>
        Built by Henry ✝️
      </footer>
    </div>
  );
}

const btn = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #334155",
  background: "transparent",
  cursor: "pointer",
};

const card = (theme) => ({
  marginTop: 18,
  padding: 20,
  borderRadius: 16,
  background: theme === "light" ? "#ffffff" : "#1e293b",
  boxShadow: "0 6px 18px rgba(0,0,0,.12)",
});
