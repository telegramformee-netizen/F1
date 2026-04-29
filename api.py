"""
F1 API utilities — wraps Jolpica (Ergast) + OpenF1
"""
import aiohttp
import asyncio
from typing import Optional
from config import JOLPICA_BASE, OPENF1_BASE, CURRENT_SEASON


async def _get(url: str, params: dict = None) -> Optional[dict | list]:
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=10)) as r:
                if r.status == 200:
                    return await r.json()
    except Exception as e:
        print(f"[API ERROR] {url}: {e}")
    return None


# ─────────────────────────────────────────────
# SCHEDULE / SESSIONS
# ─────────────────────────────────────────────

async def get_next_sessions() -> list[dict]:
    """Return upcoming sessions from OpenF1 (sorted by date)."""
    data = await _get(f"{OPENF1_BASE}/sessions", params={
        "year": CURRENT_SEASON,
    })
    if not data:
        return []
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    upcoming = [
        s for s in data
        if s.get("date_start") and
           datetime.fromisoformat(s["date_start"].replace("Z", "+00:00")) > now
    ]
    upcoming.sort(key=lambda x: x["date_start"])
    return upcoming[:5]   # next 5 sessions


async def get_race_schedule() -> list[dict]:
    """Full 2025 race calendar from Jolpica."""
    data = await _get(f"{JOLPICA_BASE}/{CURRENT_SEASON}.json")
    if not data:
        return []
    try:
        return data["MRData"]["RaceTable"]["Races"]
    except (KeyError, TypeError):
        return []


# ─────────────────────────────────────────────
# STANDINGS
# ─────────────────────────────────────────────

async def get_driver_standings() -> list[dict]:
    data = await _get(f"{JOLPICA_BASE}/{CURRENT_SEASON}/driverStandings.json")
    if not data:
        return []
    try:
        return data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"]
    except (KeyError, IndexError):
        return []


async def get_constructor_standings() -> list[dict]:
    data = await _get(f"{JOLPICA_BASE}/{CURRENT_SEASON}/constructorStandings.json")
    if not data:
        return []
    try:
        return data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"]
    except (KeyError, IndexError):
        return []


# ─────────────────────────────────────────────
# DRIVERS
# ─────────────────────────────────────────────

async def get_all_drivers() -> list[dict]:
    """Current season drivers list."""
    data = await _get(f"{JOLPICA_BASE}/{CURRENT_SEASON}/drivers.json", params={"limit": 30})
    if not data:
        return []
    try:
        return data["MRData"]["DriverTable"]["Drivers"]
    except (KeyError, TypeError):
        return []


async def get_driver_results(driver_id: str) -> list[dict]:
    """All race results for a driver this season."""
    data = await _get(f"{JOLPICA_BASE}/{CURRENT_SEASON}/drivers/{driver_id}/results.json",
                      params={"limit": 30})
    if not data:
        return []
    try:
        return data["MRData"]["RaceTable"]["Races"]
    except (KeyError, TypeError):
        return []


async def get_driver_season_stats(driver_id: str) -> dict:
    """Aggregate stats: wins, podiums, DNFs, points, avg finish."""
    races = await get_driver_results(driver_id)
    wins = podiums = dnfs = points_total = 0
    finishes = []

    for race in races:
        results = race.get("Results", [])
        if not results:
            continue
        r = results[0]
        pos  = r.get("position", "")
        stat = r.get("status", "")
        pts  = float(r.get("points", 0))
        points_total += pts

        if pos.isdigit():
            p = int(pos)
            finishes.append(p)
            if p == 1: wins += 1
            if p <= 3: podiums += 1

        if "Retired" in stat or "Accident" in stat or "Collision" in stat or \
           "Engine" in stat or "Mechanical" in stat or "Did not" in stat:
            dnfs += 1

    avg = round(sum(finishes) / len(finishes), 1) if finishes else "—"
    return {
        "races":   len(races),
        "wins":    wins,
        "podiums": podiums,
        "dnfs":    dnfs,
        "points":  int(points_total),
        "avg_pos": avg,
    }


# ─────────────────────────────────────────────
# CONSTRUCTORS
# ─────────────────────────────────────────────

async def get_all_constructors() -> list[dict]:
    data = await _get(f"{JOLPICA_BASE}/{CURRENT_SEASON}/constructors.json")
    if not data:
        return []
    try:
        return data["MRData"]["ConstructorTable"]["Constructors"]
    except (KeyError, TypeError):
        return []


async def get_constructor_results(constructor_id: str) -> list[dict]:
    data = await _get(
        f"{JOLPICA_BASE}/{CURRENT_SEASON}/constructors/{constructor_id}/results.json",
        params={"limit": 100}
    )
    if not data:
        return []
    try:
        return data["MRData"]["RaceTable"]["Races"]
    except (KeyError, TypeError):
        return []


# ─────────────────────────────────────────────
# HEAD-TO-HEAD
# ─────────────────────────────────────────────

async def get_head_to_head(driver1_id: str, driver2_id: str) -> dict:
    """Compare two drivers for the current season."""
    r1, r2 = await asyncio.gather(
        get_driver_season_stats(driver1_id),
        get_driver_season_stats(driver2_id),
    )
    return {"d1": r1, "d2": r2}
