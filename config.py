import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")

# Timezone
TASHKENT_TZ = "Asia/Tashkent"

# APIs
JOLPICA_BASE = "https://api.jolpi.ca/ergast/f1"
OPENF1_BASE  = "https://api.openf1.org/v1"

CURRENT_SEASON = 2025

# Emoji set
EMOJI = {
    "f1":      "🏎️",
    "timer":   "⏱️",
    "flag":    "🏁",
    "trophy":  "🏆",
    "driver":  "👤",
    "team":    "🏢",
    "stats":   "📊",
    "fire":    "🔥",
    "green":   "🟢",
    "red":     "🔴",
    "yellow":  "🟡",
    "back":    "◀️",
    "next":    "▶️",
    "menu":    "🏠",
    "vs":      "⚔️",
    "podium":  "🥇",
    "calendar":"📅",
    "speed":   "💨",
    "star":    "⭐",
    "circuit": "🗺️",
}

# Team colors (hex → emoji approximation)
TEAM_COLORS = {
    "red_bull":         "🔵",
    "ferrari":          "🔴",
    "mercedes":         "⚫",
    "mclaren":          "🟠",
    "aston_martin":     "🟢",
    "alpine":           "🔵",
    "williams":         "🔵",
    "rb":               "🔵",
    "kick_sauber":      "🟢",
    "haas":             "⚪",
}

TEAM_FULL_NAMES = {
    "red_bull":         "Red Bull Racing",
    "ferrari":          "Scuderia Ferrari",
    "mercedes":         "Mercedes-AMG Petronas",
    "mclaren":          "McLaren F1 Team",
    "aston_martin":     "Aston Martin Aramco",
    "alpine":           "BWT Alpine F1 Team",
    "williams":         "Williams Racing",
    "rb":               "Visa Cash App RB",
    "kick_sauber":      "Stake F1 Kick Sauber",
    "haas":             "MoneyGram Haas F1",
}

# Flag emojis by nationality
NATIONALITY_FLAGS = {
    "British":      "🇬🇧",
    "German":       "🇩🇪",
    "Dutch":        "🇳🇱",
    "Spanish":      "🇪🇸",
    "Monegasque":   "🇲🇨",
    "Mexican":      "🇲🇽",
    "Australian":   "🇦🇺",
    "Canadian":     "🇨🇦",
    "Finnish":      "🇫🇮",
    "French":       "🇫🇷",
    "Japanese":     "🇯🇵",
    "Thai":         "🇹🇭",
    "Chinese":      "🇨🇳",
    "Danish":       "🇩🇰",
    "American":     "🇺🇸",
    "Brazilian":    "🇧🇷",
    "Italian":      "🇮🇹",
    "Argentine":    "🇦🇷",
    "New Zealander": "🇳🇿",
    "Austrian":     "🇦🇹",
    "Swiss":        "🇨🇭",
}
