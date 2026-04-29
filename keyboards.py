"""
Inline keyboard builders for the F1 bot.
"""
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder
from config import EMOJI, NATIONALITY_FLAGS


def main_menu_kb() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(text=f"{EMOJI['timer']} Taymer",       callback_data="menu:timer"),
        InlineKeyboardButton(text=f"{EMOJI['trophy']} Reyting",     callback_data="menu:standings"),
    )
    builder.row(
        InlineKeyboardButton(text=f"{EMOJI['driver']} Haydovchilar", callback_data="menu:drivers"),
        InlineKeyboardButton(text=f"{EMOJI['team']} Jamoalar",       callback_data="menu:teams"),
    )
    builder.row(
        InlineKeyboardButton(text=f"{EMOJI['vs']} H2H Taqqoslash", callback_data="menu:h2h"),
    )
    return builder.as_markup()


def back_to_menu_kb() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.button(text=f"{EMOJI['menu']} Bosh Menyu", callback_data="menu:main")
    return builder.as_markup()


def standings_kb() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(text=f"{EMOJI['driver']} Haydovchilar", callback_data="standings:drivers"),
        InlineKeyboardButton(text=f"{EMOJI['team']} Konstruktorlar", callback_data="standings:constructors"),
    )
    builder.row(InlineKeyboardButton(text=f"{EMOJI['menu']} Bosh Menyu", callback_data="menu:main"))
    return builder.as_markup()


def drivers_list_kb(drivers: list, prefix: str = "driver") -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    for d in drivers:
        did  = d["driverId"]
        name = f"{d['givenName']} {d['familyName']}"
        nat  = d.get("nationality", "")
        flag = NATIONALITY_FLAGS.get(nat, "")
        num  = d.get("permanentNumber", "")
        builder.button(
            text=f"{flag} #{num} {name}",
            callback_data=f"{prefix}:{did}"
        )
    builder.adjust(2)
    builder.row(InlineKeyboardButton(text=f"{EMOJI['menu']} Bosh Menyu", callback_data="menu:main"))
    return builder.as_markup()


def driver_detail_kb(driver_id: str) -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(text="📊 Statistika", callback_data=f"dstats:{driver_id}"),
    )
    builder.row(
        InlineKeyboardButton(text=f"{EMOJI['back']} Haydovchilar", callback_data="menu:drivers"),
        InlineKeyboardButton(text=f"{EMOJI['menu']} Menyu",        callback_data="menu:main"),
    )
    return builder.as_markup()


def teams_list_kb(constructors: list) -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    from config import TEAM_COLORS
    for c in constructors:
        cid   = c["constructorId"]
        name  = c["name"]
        color = TEAM_COLORS.get(cid, "⬜")
        builder.button(text=f"{color} {name}", callback_data=f"team:{cid}")
    builder.adjust(2)
    builder.row(InlineKeyboardButton(text=f"{EMOJI['menu']} Bosh Menyu", callback_data="menu:main"))
    return builder.as_markup()


def team_detail_kb(constructor_id: str) -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(text=f"{EMOJI['back']} Jamoalar", callback_data="menu:teams"),
        InlineKeyboardButton(text=f"{EMOJI['menu']} Menyu",    callback_data="menu:main"),
    )
    return builder.as_markup()


def h2h_select_first_kb(drivers: list) -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    for d in drivers:
        did  = d["driverId"]
        name = f"{d['givenName']} {d['familyName']}"
        nat  = d.get("nationality", "")
        flag = NATIONALITY_FLAGS.get(nat, "")
        builder.button(text=f"{flag} {name}", callback_data=f"h2h_1:{did}")
    builder.adjust(2)
    builder.row(InlineKeyboardButton(text=f"{EMOJI['menu']} Bosh Menyu", callback_data="menu:main"))
    return builder.as_markup()


def h2h_select_second_kb(drivers: list, first_id: str) -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    for d in drivers:
        did  = d["driverId"]
        if did == first_id:
            continue
        name = f"{d['givenName']} {d['familyName']}"
        nat  = d.get("nationality", "")
        flag = NATIONALITY_FLAGS.get(nat, "")
        builder.button(text=f"{flag} {name}", callback_data=f"h2h_2:{first_id}:{did}")
    builder.adjust(2)
    builder.row(InlineKeyboardButton(text=f"{EMOJI['menu']} Bosh Menyu", callback_data="menu:main"))
    return builder.as_markup()
