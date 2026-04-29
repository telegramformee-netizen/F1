"""
Message formatting helpers — returns pretty Telegram HTML strings.
"""
from datetime import datetime, timezone, timedelta
import pytz
from config import EMOJI, NATIONALITY_FLAGS, TEAM_COLORS, TEAM_FULL_NAMES, TASHKENT_TZ


TZ_TASHKENT = pytz.timezone(TASHKENT_TZ)


def _tashkent(dt_str: str) -> str:
    """Convert ISO datetime string to Tashkent time string."""
    try:
        dt = datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
        dt_tash = dt.astimezone(TZ_TASHKENT)
        return dt_tash.strftime("%d %b %Y, %H:%M")
    except Exception:
        return dt_str


def format_countdown(target_dt_str: str) -> str:
    """Return human-readable countdown from now to target."""
    try:
        target = datetime.fromisoformat(target_dt_str.replace("Z", "+00:00"))
        now    = datetime.now(timezone.utc)
        delta  = target - now
        if delta.total_seconds() < 0:
            return "Yakunlangan ✅"
        days    = delta.days
        hours   = delta.seconds // 3600
        minutes = (delta.seconds % 3600) // 60
        parts = []
        if days:    parts.append(f"{days} kun")
        if hours:   parts.append(f"{hours} soat")
        if minutes: parts.append(f"{minutes} daqiqa")
        return " ".join(parts) or "Hozir boshlanmoqda!"
    except Exception:
        return "—"


SESSION_NAMES = {
    "practice_1":   "🟡 1-mashq",
    "practice_2":   "🟡 2-mashq",
    "practice_3":   "🟡 3-mashq",
    "sprint_qualifying": "🟠 Sprint Kvalifikatsiya",
    "sprint":       "🟠 Sprint Poyga",
    "qualifying":   "🔵 Kvalifikatsiya",
    "race":         "🔴 Asosiy Poyga",
}


def format_next_sessions(sessions: list) -> str:
    if not sessions:
        return "⚠️ Keyingi sessiyalar topilmadi."

    lines = [f"{EMOJI['timer']} <b>Keyingi F1 Sessiyalar</b> (Toshkent vaqti)\n"]
    for s in sessions:
        stype     = s.get("session_type", "").lower().replace(" ", "_")
        sname     = SESSION_NAMES.get(stype, f"📍 {s.get('session_type', '?')}")
        circuit   = s.get("circuit_short_name", s.get("location", ""))
        country   = s.get("country_name", "")
        start_str = s.get("date_start", "")
        tash_time = _tashkent(start_str) if start_str else "—"
        countdown = format_countdown(start_str) if start_str else "—"

        lines.append(
            f"{sname}\n"
            f"  {EMOJI['circuit']} {circuit}, {country}\n"
            f"  {EMOJI['calendar']} {tash_time}\n"
            f"  {EMOJI['timer']} Qoldi: <b>{countdown}</b>\n"
        )
    return "\n".join(lines)


def format_driver_card(driver: dict, standing: dict = None, stats: dict = None) -> str:
    name  = f"{driver.get('givenName','')} {driver.get('familyName','')}"
    num   = driver.get("permanentNumber", "—")
    nat   = driver.get("nationality", "—")
    flag  = NATIONALITY_FLAGS.get(nat, "🏳️")
    dob   = driver.get("dateOfBirth", "—")
    url   = driver.get("url", "")

    # Age
    try:
        birth = datetime.strptime(dob, "%Y-%m-%d")
        age   = (datetime.now() - birth).days // 365
    except Exception:
        age = "—"

    pos    = standing.get("position", "—")   if standing else "—"
    points = standing.get("points", "—")     if standing else "—"
    team   = standing["Constructors"][0]["name"] if standing and standing.get("Constructors") else "—"

    card = (
        f"╔══════════════════════╗\n"
        f"  {EMOJI['driver']} <b>{name}</b>  #{num}\n"
        f"  {flag} {nat}\n"
        f"  🎂 {dob}  (Yosh: {age})\n"
        f"  🏢 {team}\n"
        f"╠══════════════════════╣\n"
        f"  📊 <b>2025 Mavsum</b>\n"
        f"  🏆 {points} ochko  —  {pos}-o'rin\n"
    )
    if stats:
        card += (
            f"  🏁 {stats['races']} poyga\n"
            f"  🥇 {stats['wins']} g'alaba  🥈 {stats['podiums']} podium\n"
            f"  ❌ {stats['dnfs']} DNF  📍 O'rtacha: {stats['avg_pos']}\n"
        )
    card += "╚══════════════════════╝"
    return card


def format_constructor_card(constructor: dict, standing: dict = None) -> str:
    cid    = constructor.get("constructorId", "")
    name   = constructor.get("name", "—")
    nat    = constructor.get("nationality", "—")
    flag   = NATIONALITY_FLAGS.get(nat, "🏳️")
    color  = TEAM_COLORS.get(cid, "⬜")
    full   = TEAM_FULL_NAMES.get(cid, name)

    pos    = standing.get("position", "—")   if standing else "—"
    points = standing.get("points", "—")     if standing else "—"
    wins   = standing.get("wins", "—")       if standing else "—"

    return (
        f"╔══════════════════════╗\n"
        f"  {color} <b>{full}</b>\n"
        f"  {flag} {nat}\n"
        f"╠══════════════════════╣\n"
        f"  📊 <b>2025 Konstruktor</b>\n"
        f"  {EMOJI['trophy']} {points} ochko  —  {pos}-o'rin\n"
        f"  🏁 {wins} g'alaba\n"
        f"╚══════════════════════╝"
    )


def format_driver_standings(standings: list) -> str:
    if not standings:
        return "⚠️ Ma'lumot topilmadi."
    lines = [f"{EMOJI['trophy']} <b>Haydovchilar Reytingi 2025</b>\n"]
    medals = {1: "🥇", 2: "🥈", 3: "🥉"}
    for s in standings[:20]:
        pos    = int(s.get("position", 0))
        medal  = medals.get(pos, f"{pos:2d}.")
        name   = f"{s['Driver']['givenName']} {s['Driver']['familyName']}"
        pts    = s.get("points", "0")
        team   = s["Constructors"][0]["name"] if s.get("Constructors") else "—"
        nat    = s["Driver"].get("nationality","")
        flag   = NATIONALITY_FLAGS.get(nat,"")
        lines.append(f"{medal} {flag} <b>{name}</b>  — {pts} pt\n   └ {team}")
    return "\n".join(lines)


def format_constructor_standings(standings: list) -> str:
    if not standings:
        return "⚠️ Ma'lumot topilmadi."
    lines = [f"{EMOJI['trophy']} <b>Konstruktorlar Reytingi 2025</b>\n"]
    medals = {1: "🥇", 2: "🥈", 3: "🥉"}
    for s in standings[:10]:
        pos    = int(s.get("position", 0))
        medal  = medals.get(pos, f"{pos:2d}.")
        name   = s["Constructor"]["name"]
        cid    = s["Constructor"]["constructorId"]
        color  = TEAM_COLORS.get(cid, "⬜")
        pts    = s.get("points", "0")
        wins   = s.get("wins", "0")
        lines.append(f"{medal} {color} <b>{name}</b>  — {pts} pt  ({wins} g'alaba)")
    return "\n".join(lines)


def format_h2h(d1_info: dict, d2_info: dict, stats: dict) -> str:
    n1 = f"{d1_info.get('givenName','')} {d1_info.get('familyName','')}"
    n2 = f"{d2_info.get('givenName','')} {d2_info.get('familyName','')}"
    s1 = stats["d1"]
    s2 = stats["d2"]

    def cmp(v1, v2, higher_better=True):
        if v1 == v2: return "🟡", "🟡"
        if higher_better:
            return ("🟢", "🔴") if v1 > v2 else ("🔴", "🟢")
        else:
            return ("🟢", "🔴") if v1 < v2 else ("🔴", "🟢")

    p_c1, p_c2 = cmp(s1["points"], s2["points"])
    w_c1, w_c2 = cmp(s1["wins"], s2["wins"])
    d_c1, d_c2 = cmp(s1["podiums"], s2["podiums"])
    dnf_c1, dnf_c2 = cmp(s1["dnfs"], s2["dnfs"], higher_better=False)
    avg_c1, avg_c2 = cmp(s1["avg_pos"], s2["avg_pos"], higher_better=False)

    return (
        f"{EMOJI['vs']} <b>Head-to-Head 2025</b>\n\n"
        f"<code>"
        f"{'Kategoria':<12} {n1[:12]:<12} {n2[:12]}\n"
        f"{'─'*40}\n"
        f"{'Ochko':<12} {p_c1}{s1['points']:<11} {p_c2}{s2['points']}\n"
        f"{'Galaba':<12} {w_c1}{s1['wins']:<11} {w_c2}{s2['wins']}\n"
        f"{'Podium':<12} {d_c1}{s1['podiums']:<11} {d_c2}{s2['podiums']}\n"
        f"{'DNF':<12} {dnf_c1}{s1['dnfs']:<11} {dnf_c2}{s2['dnfs']}\n"
        f"{'O`rt.Finsh':<12} {avg_c1}{s1['avg_pos']:<11} {avg_c2}{s2['avg_pos']}\n"
        f"{'Poygalar':<12} {s1['races']:<12} {s2['races']}\n"
        f"</code>"
    )
