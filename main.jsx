import { useState, useEffect, useRef } from "react";

const TRANSLATIONS = {
  EN: {
    raceHub: "Race Hub", predict: "Predict", telemetry: "Telemetry",
    drivers: "Drivers", standings: "Standings",
    nextRace: "NEXT RACE", practice: "PRACTICE", qualifying: "QUALIFYING", race: "RACE",
    days: "D", hours: "H", mins: "M", secs: "S",
    weather: "Race Weather", rain: "Rain chance",
    drs: "DRS Zones", corners: "Corners", lapRecord: "Lap Record",
    yourPrediction: "Your Prediction", p1: "1st Place", p2: "2nd Place", p3: "3rd Place",
    pole: "Pole Position", fastestLap: "Fastest Lap",
    submitPick: "LOCK IN PICKS", leaderboard: "Leaderboard",
    livePos: "Live Positions", tyreStatus: "Tyre Status",
    soft: "Soft", medium: "Medium", hard: "Hard",
    laps: "laps", compound: "Compound", wear: "Wear",
    allDrivers: "All Drivers", allTeams: "All Teams",
    points: "Points", wins: "Wins", podiums: "Podiums",
    compare: "Head-to-Head", vs: "VS",
    driversChamp: "DRIVERS CHAMPIONSHIP", constructors: "CONSTRUCTORS",
    pos: "POS", driver: "DRIVER", pts: "PTS", gap: "GAP",
    dayMode: "Light", nightMode: "Dark",
    tashkentTime: "Tashkent Time",
    selectDriver: "Select driver",
  },
  RU: {
    raceHub: "Хаб Гонки", predict: "Прогноз", telemetry: "Телеметрия",
    drivers: "Пилоты", standings: "Таблица",
    nextRace: "СЛЕДУЮЩАЯ ГОНКА", practice: "ПРАКТИКА", qualifying: "КВАЛИФИКАЦИЯ", race: "ГОНКА",
    days: "Д", hours: "Ч", mins: "М", secs: "С",
    weather: "Погода на гонку", rain: "Вероятность дождя",
    drs: "Зоны DRS", corners: "Повороты", lapRecord: "Рекорд круга",
    yourPrediction: "Ваш прогноз", p1: "1-е место", p2: "2-е место", p3: "3-е место",
    pole: "Поул-позиция", fastestLap: "Быстрый круг",
    submitPick: "ПОДТВЕРДИТЬ ВЫБОР", leaderboard: "Рейтинг",
    livePos: "Позиции онлайн", tyreStatus: "Состояние шин",
    soft: "Мягкая", medium: "Средняя", hard: "Твёрдая",
    laps: "круги", compound: "Тип", wear: "Износ",
    allDrivers: "Все пилоты", allTeams: "Все команды",
    points: "Очки", wins: "Победы", podiums: "Подиумы",
    compare: "Сравнение", vs: "ПРО",
    driversChamp: "ЛИЧНЫЙ ЗАЧЁТ", constructors: "КУБОК КОНСТРУКТОРОВ",
    pos: "МЕС", driver: "ПИЛОТ", pts: "ОЧК", gap: "ОТ",
    dayMode: "День", nightMode: "Ночь",
    tashkentTime: "Время Ташкент",
    selectDriver: "Выбрать пилота",
  },
  UZ: {
    raceHub: "Poyga Markazi", predict: "Bashorat", telemetry: "Telemetriya",
    drivers: "Haydovchilar", standings: "Jadval",
    nextRace: "KEYINGI POYGA", practice: "MASHQ", qualifying: "KVALIFIKATSIYA", race: "POYGA",
    days: "K", hours: "S", mins: "D", secs: "S",
    weather: "Poyga ob-havosi", rain: "Yomg'ir ehtimoli",
    drs: "DRS Zonalari", corners: "Burilishlar", lapRecord: "Aylanma rekord",
    yourPrediction: "Sizning bashoratingiz", p1: "1-o'rin", p2: "2-o'rin", p3: "3-o'rin",
    pole: "Pol-pozitsiya", fastestLap: "Eng tez aylanma",
    submitPick: "TASDIQLASH", leaderboard: "Reyting",
    livePos: "Jonli pozitsiyalar", tyreStatus: "Shina holati",
    soft: "Yumshoq", medium: "O'rta", hard: "Qattiq",
    laps: "aylanma", compound: "Tur", wear: "Eskilik",
    allDrivers: "Barcha haydovchilar", allTeams: "Barcha jamoalar",
    points: "Ballar", wins: "G'alabalar", podiums: "Podiumlar",
    compare: "Taqqoslash", vs: "VS",
    driversChamp: "HAYDOVCHILAR CHEMPIONATI", constructors: "KONSTRUKTORLAR",
    pos: "O'RIN", driver: "HAYDOVCHI", pts: "BAL", gap: "FARQ",
    dayMode: "Kun", nightMode: "Tun",
    tashkentTime: "Toshkent vaqti",
    selectDriver: "Haydovchi tanlang",
  },
};

const DRIVERS = [
  { id: 1, name: "Max Verstappen", abbr: "VER", team: "Red Bull Racing", flag: "🇳🇱", pts: 195, wins: 6, podiums: 8, color: "#3671C6", num: 1 },
  { id: 2, name: "Lando Norris", abbr: "NOR", team: "McLaren", flag: "🇬🇧", pts: 171, wins: 3, podiums: 7, color: "#FF8000", num: 4 },
  { id: 3, name: "Charles Leclerc", abbr: "LEC", team: "Ferrari", flag: "🇲🇨", pts: 150, wins: 2, podiums: 5, color: "#E8002D", num: 16 },
  { id: 4, name: "Oscar Piastri", abbr: "PIA", team: "McLaren", flag: "🇦🇺", pts: 144, wins: 2, podiums: 6, color: "#FF8000", num: 81 },
  { id: 5, name: "Carlos Sainz", abbr: "SAI", team: "Williams", flag: "🇪🇸", pts: 121, wins: 0, podiums: 3, color: "#37BEDD", num: 55 },
  { id: 6, name: "George Russell", abbr: "RUS", team: "Mercedes", flag: "🇬🇧", pts: 111, wins: 1, podiums: 4, color: "#27F4D2", num: 63 },
  { id: 7, name: "Lewis Hamilton", abbr: "HAM", team: "Ferrari", flag: "🇬🇧", pts: 104, wins: 0, podiums: 3, color: "#E8002D", num: 44 },
  { id: 8, name: "Yuki Tsunoda", abbr: "TSU", team: "Red Bull Racing", flag: "🇯🇵", pts: 58, wins: 0, podiums: 1, color: "#3671C6", num: 22 },
];

const CONSTRUCTORS = [
  { name: "McLaren", pts: 315, color: "#FF8000" },
  { name: "Ferrari", pts: 254, color: "#E8002D" },
  { name: "Red Bull Racing", pts: 253, color: "#3671C6" },
  { name: "Mercedes", pts: 155, color: "#27F4D2" },
  { name: "Williams", pts: 140, color: "#37BEDD" },
  { name: "Aston Martin", pts: 62, color: "#358C75" },
];

const LIVE_POSITIONS = [
  { pos: 1, abbr: "NOR", name: "Norris", compound: "M", compColor: "#FFD700", lapsOn: 18, wear: 42, gap: "LEADER", speed: 328 },
  { pos: 2, abbr: "VER", name: "Verstappen", compound: "H", compColor: "#e0e0e0", lapsOn: 22, wear: 55, gap: "+3.2s", speed: 325 },
  { pos: 3, abbr: "LEC", name: "Leclerc", compound: "S", compColor: "#E10600", lapsOn: 11, wear: 38, gap: "+7.8s", speed: 322 },
  { pos: 4, abbr: "PIA", name: "Piastri", compound: "M", compColor: "#FFD700", lapsOn: 18, wear: 44, gap: "+12.1s", speed: 320 },
  { pos: 5, abbr: "RUS", name: "Russell", compound: "H", compColor: "#e0e0e0", lapsOn: 22, wear: 61, gap: "+18.4s", speed: 317 },
];

function useCountdown(targetDate) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) return setTime({ d: 0, h: 0, m: 0, s: 0 });
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

const NEXT_RACE_DATE = new Date("2025-05-25T13:00:00+05:00").getTime();
const QUAL_DATE = new Date("2025-05-24T15:00:00+05:00").getTime();
const PRACTICE_DATE = new Date("2025-05-23T14:00:00+05:00").getTime();

export default function F1App() {
  const [tab, setTab] = useState(0);
  const [lang, setLang] = useState("UZ");
  const [dark, setDark] = useState(true);
  const [driverView, setDriverView] = useState("drivers");
  const [selectedDriver1, setSelectedDriver1] = useState(0);
  const [selectedDriver2, setSelectedDriver2] = useState(1);
  const [predictions, setPredictions] = useState({ p1: "", p2: "", p3: "", pole: "", fl: "" });
  const [submitted, setSubmitted] = useState(false);
  const [standingsTab, setStandingsTab] = useState("drivers");
  const t = TRANSLATIONS[lang];
  const raceTime = useCountdown(NEXT_RACE_DATE);
  const qualTime = useCountdown(QUAL_DATE);
  const pracTime = useCountdown(PRACTICE_DATE);

  const bg = dark ? "#080808" : "#f0f0f0";
  const surface = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const surface2 = dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.07)";
  const txt = dark ? "#ffffff" : "#0a0a0a";
  const txtMuted = dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const RED = "#E10600";

  const styles = {
    app: {
      fontFamily: "-apple-system, 'SF Pro Display', 'SF Pro Text', BlinkMacSystemFont, sans-serif",
      background: bg,
      minHeight: "100vh",
      color: txt,
      transition: "background 0.3s, color 0.3s",
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    },
    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 20px 12px",
      borderBottom: `1px solid ${border}`,
      background: dark ? "rgba(8,8,8,0.95)" : "rgba(240,240,240,0.95)",
      backdropFilter: "blur(20px)",
      position: "sticky", top: 0, zIndex: 100,
    },
    logo: {
      fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: RED,
      fontStyle: "italic",
    },
    controls: { display: "flex", gap: 8, alignItems: "center" },
    langBtn: (active) => ({
      fontSize: 11, fontWeight: 600, padding: "4px 8px",
      borderRadius: 6, border: `1px solid ${active ? RED : border}`,
      background: active ? RED : "transparent",
      color: active ? "#fff" : txtMuted, cursor: "pointer",
      transition: "all 0.2s",
    }),
    modeBtn: {
      fontSize: 11, padding: "4px 8px", borderRadius: 6,
      border: `1px solid ${border}`, background: "transparent",
      color: txtMuted, cursor: "pointer",
    },
    scroll: { padding: "0 0 90px", overflowY: "auto" },
    section: { padding: "16px 20px" },
    card: (extra = {}) => ({
      background: surface,
      border: `1px solid ${border}`,
      borderRadius: 16,
      padding: "16px",
      backdropFilter: "blur(10px)",
      ...extra,
    }),
    label: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: RED, marginBottom: 8 },
    h2: { fontSize: 20, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.3 },
    timerBlock: {
      display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, margin: "12px 0",
    },
    timerCell: {
      background: surface2, borderRadius: 12, padding: "12px 8px",
      textAlign: "center", border: `1px solid ${border}`,
    },
    timerNum: { fontSize: 28, fontWeight: 800, letterSpacing: -1, color: RED, lineHeight: 1 },
    timerLabel: { fontSize: 9, fontWeight: 600, letterSpacing: 1.5, color: txtMuted, marginTop: 4 },
    sessionRow: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 12px", background: surface2, borderRadius: 10,
      border: `1px solid ${border}`, marginBottom: 6,
    },
    pill: (color = RED) => ({
      fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: "3px 8px",
      borderRadius: 20, background: color + "22", color: color, border: `1px solid ${color}44`,
    }),
    trackSvg: {
      width: "100%", borderRadius: 12, marginTop: 8,
      background: surface2, border: `1px solid ${border}`,
    },
    weatherRow: {
      display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10,
    },
    weatherCell: {
      textAlign: "center", background: surface2, borderRadius: 10,
      padding: "10px 8px", border: `1px solid ${border}`,
    },
    weatherNum: { fontSize: 20, fontWeight: 700 },
    weatherLbl: { fontSize: 10, color: txtMuted, marginTop: 2 },
    predCard: {
      background: surface2, borderRadius: 12, padding: 12,
      border: `1px solid ${border}`, marginBottom: 8,
    },
    select: {
      width: "100%", background: surface, color: txt, border: `1px solid ${border}`,
      borderRadius: 8, padding: "8px 10px", fontSize: 13,
      fontFamily: "-apple-system, sans-serif", marginTop: 6,
    },
    submitBtn: {
      width: "100%", background: RED, color: "#fff",
      border: "none", borderRadius: 12, padding: "14px",
      fontSize: 13, fontWeight: 800, letterSpacing: 1.5,
      cursor: "pointer", marginTop: 12,
    },
    lbRow: (i) => ({
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px", background: i < 3 ? surface2 : "transparent",
      borderRadius: 10, marginBottom: 4,
    }),
    rank: (i) => ({
      width: 24, height: 24, borderRadius: "50%", display: "flex",
      alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
      background: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : border,
      color: i < 3 ? "#000" : txt,
    }),
    liveTable: { width: "100%", borderCollapse: "collapse" },
    liveRow: (i) => ({
      background: i % 2 === 0 ? surface2 : "transparent",
    }),
    liveTd: { padding: "10px 8px", fontSize: 12 },
    wearBar: (pct, compound) => {
      const c = compound === "S" ? "#E10600" : compound === "M" ? "#FFD700" : "#aaa";
      return (
        <div style={{ width: 60, height: 4, background: border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: c, borderRadius: 2 }} />
        </div>
      );
    },
    driverCard: (color) => ({
      background: surface, border: `1px solid ${color}33`,
      borderRadius: 14, padding: "14px", cursor: "pointer",
      transition: "transform 0.15s", position: "relative", overflow: "hidden",
    }),
    accentBar: (color) => ({
      position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color,
    }),
    tabBar: {
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      display: "flex", borderTop: `1px solid ${border}`,
      background: dark ? "rgba(8,8,8,0.97)" : "rgba(240,240,240,0.97)",
      backdropFilter: "blur(20px)",
    },
    tabBtn: (active) => ({
      flex: 1, padding: "10px 4px 14px", display: "flex",
      flexDirection: "column", alignItems: "center", gap: 3,
      background: "none", border: "none", cursor: "pointer",
      color: active ? RED : txtMuted, transition: "color 0.2s",
    }),
    tabIcon: { fontSize: 20 },
    tabLabel: { fontSize: 9, fontWeight: active => active ? 700 : 400, letterSpacing: 0.5 },
  };

  const TABS = [
    { icon: "🏎", label: t.raceHub },
    { icon: "🎮", label: t.predict },
    { icon: "📡", label: t.telemetry },
    { icon: "📇", label: t.drivers },
    { icon: "📊", label: t.standings },
  ];

  const LEADERBOARD = [
    { name: "Azizbek T.", pts: 47 }, { name: "Madina R.", pts: 39 },
    { name: "Jamshid K.", pts: 35 }, { name: "Sarvar N.", pts: 28 },
    { name: "Dilorom A.", pts: 21 },
  ];

  function TimeBlock({ time, label }) {
    return (
      <div style={styles.timerCell}>
        <div style={styles.timerNum}>{String(time).padStart(2, "0")}</div>
        <div style={styles.timerLabel}>{label}</div>
      </div>
    );
  }

  function TrackMap() {
    return (
      <svg viewBox="0 0 340 180" style={styles.trackSvg}>
        <defs>
          <filter id="glow">
            <feGaussingBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="340" height="180" fill="transparent" />
        <path d="M 30 80 Q 30 30, 100 30 L 240 30 Q 310 30, 310 80 L 310 130 Q 310 155, 280 155 L 180 155 Q 160 155, 155 140 L 155 110 Q 155 95, 140 95 L 90 95 Q 60 95, 60 130 Q 60 155, 80 155 L 120 155"
          fill="none" stroke={RED} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        <path d="M 30 80 Q 30 30, 100 30 L 240 30 Q 310 30, 310 80 L 310 130 Q 310 155, 280 155 L 180 155 Q 160 155, 155 140 L 155 110 Q 155 95, 140 95 L 90 95 Q 60 95, 60 130 Q 60 155, 80 155 L 120 155"
          fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 6" opacity="0.3" />
        {[[100, 30], [245, 30], [310, 80], [310, 140], [155, 130], [90, 95]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" fill={RED} opacity="0.9" />
        ))}
        <rect x="25" y="73" width="12" height="14" rx="2" fill="#FFD700" opacity="0.9" />
        <text x="40" y="83" fill={dark ? "#fff" : "#000"} fontSize="8" opacity="0.6">START</text>
        <text x="8" y="50" fill={RED} fontSize="9" fontWeight="700">T1</text>
        <text x="245" y="22" fill={RED} fontSize="9" fontWeight="700">T5</text>
        <text x="315" y="100" fill={RED} fontSize="9" fontWeight="700">T8</text>
        <rect x="0" y="55" width="8" height="22" rx="2" fill="#00FF88" opacity="0.8" />
        <rect x="230" y="20" width="22" height="8" rx="2" fill="#00FF88" opacity="0.8" />
      </svg>
    );
  }

  function RaceHub() {
    return (
      <div style={styles.scroll}>
        <div style={styles.section}>
          <div style={styles.label}>{t.nextRace}</div>
          <div style={styles.h2}>🇲🇨 Monaco Grand Prix</div>
          <div style={{ fontSize: 12, color: txtMuted, marginBottom: 12 }}>
            Circuit de Monaco • 23–25 May 2025
          </div>
          <div style={styles.card()}>
            <div style={{ fontSize: 11, color: RED, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
              🏁 {t.race.toUpperCase()} — {t.tashkentTime}
            </div>
            <div style={styles.timerBlock}>
              <TimeBlock time={raceTime.d} label={t.days} />
              <TimeBlock time={raceTime.h} label={t.hours} />
              <TimeBlock time={raceTime.m} label={t.mins} />
              <TimeBlock time={raceTime.s} label={t.secs} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
              {[
                { label: t.practice, time: pracTime, color: "#00AA55" },
                { label: t.qualifying, time: qualTime, color: "#FFD700" },
              ].map(({ label, time, color }) => (
                <div key={label} style={styles.sessionRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={styles.pill(color)}>{label}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5, color: txt }}>
                    {String(time.d).padStart(2,"0")}d {String(time.h).padStart(2,"0")}h {String(time.m).padStart(2,"0")}m
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...styles.card(), marginTop: 12 }}>
            <div style={styles.label}>🗺 {t.drs} · {t.corners}: 19 · {t.lapRecord}: 1:10.166</div>
            <TrackMap />
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: txtMuted }}>
                <div style={{ width: 16, height: 6, background: "#00FF88", borderRadius: 2 }} /> DRS Zone
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: txtMuted }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED }} /> Slow corner
              </div>
            </div>
          </div>

          <div style={{ ...styles.card(), marginTop: 12 }}>
            <div style={styles.label}>🌤 {t.weather} — Monaco</div>
            <div style={styles.weatherRow}>
              <div style={styles.weatherCell}>
                <div style={styles.weatherNum}>22°C</div>
                <div style={styles.weatherLbl}>Air</div>
              </div>
              <div style={styles.weatherCell}>
                <div style={styles.weatherNum}>31°C</div>
                <div style={styles.weatherLbl}>Track</div>
              </div>
              <div style={styles.weatherCell}>
                <div style={{ ...styles.weatherNum, color: "#4DA6FF" }}>8%</div>
                <div style={styles.weatherLbl}>{t.rain}</div>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: txtMuted, lineHeight: 1.6 }}>
              ☀️ Sunny · Wind 12 km/h NW · Humidity 65%
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Predict() {
    const driverNames = DRIVERS.map(d => d.name);
    const pick = (key, val) => setPredictions(p => ({ ...p, [key]: val }));
    return (
      <div style={styles.scroll}>
        <div style={styles.section}>
          <div style={styles.label}>🎮 {t.yourPrediction.toUpperCase()}</div>
          <div style={styles.h2}>Monaco GP 2025</div>
          <div style={{ fontSize: 12, color: txtMuted, marginBottom: 16 }}>
            Locks in: 24 May 14:00 Toshkent
          </div>
          {[
            { key: "p1", label: "🥇 " + t.p1 },
            { key: "p2", label: "🥈 " + t.p2 },
            { key: "p3", label: "🥉 " + t.p3 },
            { key: "pole", label: "⚡ " + t.pole },
            { key: "fl", label: "⏱ " + t.fastestLap },
          ].map(({ key, label }) => (
            <div key={key} style={styles.predCard}>
              <div style={{ fontSize: 12, fontWeight: 600, color: txtMuted }}>{label}</div>
              {submitted ? (
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 6, color: txt }}>
                  {predictions[key] || "—"}
                </div>
              ) : (
                <select style={styles.select} value={predictions[key]}
                  onChange={e => pick(key, e.target.value)}>
                  <option value="">{t.selectDriver}</option>
                  {driverNames.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              )}
            </div>
          ))}
          {!submitted ? (
            <button style={styles.submitBtn} onClick={() => setSubmitted(true)}>
              {t.submitPick} 🔒
            </button>
          ) : (
            <div style={{ ...styles.card({ marginTop: 12, borderColor: "#00AA5566" }), textAlign: "center" }}>
              <div style={{ fontSize: 24 }}>✅</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>Picks locked in!</div>
              <div style={{ fontSize: 11, color: txtMuted, marginTop: 4 }}>
                Results after Sunday race
              </div>
              <button style={{ ...styles.submitBtn, background: surface2, color: txt, marginTop: 12 }}
                onClick={() => setSubmitted(false)}>
                Edit Picks
              </button>
            </div>
          )}

          <div style={{ ...styles.card(), marginTop: 20 }}>
            <div style={styles.label}>🏆 {t.leaderboard.toUpperCase()}</div>
            {LEADERBOARD.map((u, i) => (
              <div key={i} style={styles.lbRow(i)}>
                <div style={styles.rank(i)}>{i + 1}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{u.name}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: RED }}>{u.pts} pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function Telemetry() {
    return (
      <div style={styles.scroll}>
        <div style={styles.section}>
          <div style={styles.label}>📡 {t.livePos.toUpperCase()}</div>
          <div style={{ ...styles.card(), padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", padding: "8px 12px",
              borderBottom: `1px solid ${border}`, background: surface2 }}>
              {["POS", "DRIVER", "TYRE", t.wear, "GAP", "KM/H"].map((h, i) => (
                <div key={i} style={{ flex: i === 1 ? 2 : 1, fontSize: 9,
                  fontWeight: 700, letterSpacing: 1, color: txtMuted }}>{h}</div>
              ))}
            </div>
            {LIVE_POSITIONS.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center",
                padding: "10px 12px", borderBottom: `1px solid ${border}`,
                background: i % 2 === 0 ? surface2 : "transparent",
                borderLeft: `3px solid ${i === 0 ? RED : "transparent"}` }}>
                <div style={{ flex: 1, fontSize: 16, fontWeight: 800, color: i === 0 ? RED : txt }}>
                  {d.pos}
                </div>
                <div style={{ flex: 2 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{d.abbr}</div>
                  <div style={{ fontSize: 10, color: txtMuted }}>{d.name}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%",
                    background: d.compColor, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 9, fontWeight: 800,
                    color: d.compound === "M" ? "#000" : "#fff" }}>{d.compound}</div>
                </div>
                <div style={{ flex: 1 }}>
                  {styles.wearBar(d.wear, d.compound)}
                  <div style={{ fontSize: 9, color: txtMuted, marginTop: 2 }}>{d.wear}%</div>
                </div>
                <div style={{ flex: 1, fontSize: 11, fontWeight: 600, color: d.gap === "LEADER" ? RED : txt }}>
                  {d.gap}
                </div>
                <div style={{ flex: 1, fontSize: 11, color: txtMuted }}>{d.speed}</div>
              </div>
            ))}
          </div>

          <div style={{ ...styles.card(), marginTop: 16 }}>
            <div style={styles.label}>🛞 {t.tyreStatus.toUpperCase()}</div>
            {LIVE_POSITIONS.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center",
                gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%",
                  background: d.compColor, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 11, fontWeight: 800,
                  color: d.compound === "M" ? "#000" : "#fff", flexShrink: 0 }}>
                  {d.compound}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between",
                    fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    <span>{d.name}</span>
                    <span style={{ color: d.wear > 50 ? RED : "#00AA55" }}>
                      {d.lapsOn} {t.laps}
                    </span>
                  </div>
                  <div style={{ height: 6, background: border, borderRadius: 3 }}>
                    <div style={{ width: `${100 - d.wear}%`, height: "100%",
                      background: d.wear > 60 ? RED : d.wear > 35 ? "#FFD700" : "#00AA55",
                      borderRadius: 3, transition: "width 0.5s" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function Drivers() {
    const d1 = DRIVERS[selectedDriver1];
    const d2 = DRIVERS[selectedDriver2];
    return (
      <div style={styles.scroll}>
        <div style={styles.section}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ v: "drivers", l: t.allDrivers }, { v: "teams", l: t.allTeams }, { v: "compare", l: t.compare }].map(({ v, l }) => (
              <button key={v} onClick={() => setDriverView(v)}
                style={{ flex: 1, padding: "8px 4px", borderRadius: 10, fontSize: 10,
                  fontWeight: 700, border: `1px solid ${driverView === v ? RED : border}`,
                  background: driverView === v ? RED : "transparent",
                  color: driverView === v ? "#fff" : txtMuted, cursor: "pointer", letterSpacing: 0.5 }}>
                {l}
              </button>
            ))}
          </div>

          {driverView === "drivers" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {DRIVERS.map(d => (
                <div key={d.id} style={styles.driverCard(d.color)}>
                  <div style={styles.accentBar(d.color)} />
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4 }}>
                    <div style={{ fontSize: 32, fontWeight: 900, color: d.color, opacity: 0.25,
                      position: "absolute", right: 16, top: 10, fontStyle: "italic" }}>
                      {d.num}
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: "50%",
                      background: d.color + "33", border: `2px solid ${d.color}66`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 800, color: d.color }}>
                      {d.abbr}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 700 }}>{d.name}</span>
                        <span style={{ fontSize: 14 }}>{d.flag}</span>
                      </div>
                      <div style={{ fontSize: 11, color: txtMuted }}>{d.team}</div>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: RED }}>{d.pts}</div>
                      <div style={{ fontSize: 9, color: txtMuted, letterSpacing: 1 }}>PTS</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 10,
                    paddingTop: 10, borderTop: `1px solid ${border}` }}>
                    <div style={{ fontSize: 11, color: txtMuted }}>
                      <span style={{ fontWeight: 700, color: txt }}>{d.wins}</span> {t.wins}
                    </div>
                    <div style={{ fontSize: 11, color: txtMuted }}>
                      <span style={{ fontWeight: 700, color: txt }}>{d.podiums}</span> {t.podiums}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {driverView === "teams" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CONSTRUCTORS.map((c, i) => (
                <div key={i} style={styles.driverCard(c.color)}>
                  <div style={styles.accentBar(c.color)} />
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10,
                      background: c.color + "33", border: `2px solid ${c.color}66`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 800, color: c.color }}>
                      {c.name.slice(0, 3).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</div>
                      <div style={{ marginTop: 6, height: 4, background: border, borderRadius: 2 }}>
                        <div style={{ width: `${(c.pts / 315) * 100}%`, height: "100%",
                          background: c.color, borderRadius: 2 }} />
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: c.color }}>{c.pts}</div>
                      <div style={{ fontSize: 9, color: txtMuted, letterSpacing: 1 }}>PTS</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {driverView === "compare" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, marginBottom: 16 }}>
                <select style={styles.select} value={selectedDriver1}
                  onChange={e => setSelectedDriver1(+e.target.value)}>
                  {DRIVERS.map((d, i) => <option key={i} value={i}>{d.name}</option>)}
                </select>
                <div style={{ display: "flex", alignItems: "center", fontWeight: 800,
                  fontSize: 14, color: RED, paddingTop: 6 }}>{t.vs}</div>
                <select style={styles.select} value={selectedDriver2}
                  onChange={e => setSelectedDriver2(+e.target.value)}>
                  {DRIVERS.map((d, i) => <option key={i} value={i}>{d.name}</option>)}
                </select>
              </div>
              {[
                { label: t.points, k: "pts" },
                { label: t.wins, k: "wins" },
                { label: t.podiums, k: "podiums" },
              ].map(({ label, k }) => {
                const v1 = d1[k], v2 = d2[k], total = v1 + v2 || 1;
                const pct1 = (v1 / total) * 100;
                return (
                  <div key={k} style={{ ...styles.card(), marginBottom: 8 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: txtMuted,
                      letterSpacing: 1, marginBottom: 8 }}>{label.toUpperCase()}</div>
                    <div style={{ display: "flex", justifyContent: "space-between",
                      marginBottom: 6, fontSize: 13, fontWeight: 700 }}>
                      <span style={{ color: d1.color }}>{v1}</span>
                      <span style={{ color: d2.color }}>{v2}</span>
                    </div>
                    <div style={{ height: 8, background: border, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${pct1}%`, height: "100%",
                        background: `linear-gradient(90deg, ${d1.color}, ${d2.color})`,
                        borderRadius: 4 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between",
                      marginTop: 4, fontSize: 10, color: txtMuted }}>
                      <span>{d1.abbr}</span>
                      <span>{d2.abbr}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  function Standings() {
    return (
      <div style={styles.scroll}>
        <div style={styles.section}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ v: "drivers", l: t.driversChamp }, { v: "constructors", l: t.constructors }].map(({ v, l }) => (
              <button key={v} onClick={() => setStandingsTab(v)}
                style={{ flex: 1, padding: "8px", borderRadius: 10, fontSize: 9,
                  fontWeight: 700, letterSpacing: 0.8,
                  border: `1px solid ${standingsTab === v ? RED : border}`,
                  background: standingsTab === v ? RED : "transparent",
                  color: standingsTab === v ? "#fff" : txtMuted, cursor: "pointer" }}>
                {l}
              </button>
            ))}
          </div>

          {standingsTab === "drivers" && (
            <div style={styles.card({ padding: 0, overflow: "hidden" })}>
              <div style={{ display: "flex", padding: "8px 14px",
                borderBottom: `1px solid ${border}`, background: surface2 }}>
                {[t.pos, t.driver, "", t.pts].map((h, i) => (
                  <div key={i} style={{ flex: i === 1 ? 3 : i === 2 ? 0.5 : 1,
                    fontSize: 9, fontWeight: 700, letterSpacing: 1, color: txtMuted }}>{h}</div>
                ))}
              </div>
              {DRIVERS.map((d, i) => (
                <div key={d.id} style={{ display: "flex", alignItems: "center",
                  padding: "12px 14px", borderBottom: `1px solid ${border}`,
                  background: i % 2 === 0 ? surface2 : "transparent",
                  borderLeft: `3px solid ${i < 3 ? d.color : "transparent"}` }}>
                  <div style={{ flex: 1, fontSize: i < 3 ? 18 : 14,
                    fontWeight: 800, color: i === 0 ? RED : txt }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{d.name}</div>
                    <div style={{ fontSize: 10, color: d.color }}>{d.team}</div>
                  </div>
                  <div style={{ flex: 0.5, fontSize: 12 }}>{d.flag}</div>
                  <div style={{ flex: 1, fontSize: 15, fontWeight: 800,
                    color: i === 0 ? RED : txt, textAlign: "right" }}>
                    {d.pts}
                  </div>
                </div>
              ))}
            </div>
          )}

          {standingsTab === "constructors" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CONSTRUCTORS.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center",
                  padding: "14px", background: surface,
                  border: `1px solid ${border}`,
                  borderLeft: `3px solid ${c.color}`,
                  borderRadius: 12 }}>
                  <div style={{ width: 28, fontSize: 16, fontWeight: 800,
                    color: i === 0 ? RED : txt }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ marginTop: 6, height: 4, background: border,
                      borderRadius: 2, width: "80%" }}>
                      <div style={{ width: `${(c.pts / 315) * 100}%`, height: "100%",
                        background: c.color, borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: c.color }}>{c.pts}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const PANELS = [RaceHub, Predict, Telemetry, Drivers, Standings];
  const Panel = PANELS[tab];

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={styles.logo}>F1 ◆ HUB</div>
        <div style={styles.controls}>
          {["UZ", "RU", "EN"].map(l => (
            <button key={l} style={styles.langBtn(lang === l)} onClick={() => setLang(l)}>{l}</button>
          ))}
          <button style={styles.modeBtn} onClick={() => setDark(!dark)}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <Panel />

      <div style={styles.tabBar}>
        {TABS.map((tb, i) => (
          <button key={i} style={styles.tabBtn(tab === i)} onClick={() => setTab(i)}>
            <span style={styles.tabIcon}>{tb.icon}</span>
            <span style={{ fontSize: 9, fontWeight: tab === i ? 700 : 400,
              letterSpacing: 0.5, color: tab === i ? RED : txtMuted }}>
              {tb.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
