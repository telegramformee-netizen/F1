"""
All aiogram handlers: commands + callback queries.
"""
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import CommandStart, Command

from config import EMOJI
from utils import api, formatters, keyboards

router = Router()

# ══════════════════════════════════════════════════
#  /start  &  /help
# ══════════════════════════════════════════════════

WELCOME = (
    f"{EMOJI['f1']} <b>F1 Tezkor Bot</b>ga xush kelibsiz!\n\n"
    "Quyidagi bo'limlardan birini tanlang:"
)


@router.message(CommandStart())
async def cmd_start(msg: Message):
    await msg.answer(WELCOME, reply_markup=keyboards.main_menu_kb(), parse_mode="HTML")


@router.message(Command("menu"))
async def cmd_menu(msg: Message):
    await msg.answer(WELCOME, reply_markup=keyboards.main_menu_kb(), parse_mode="HTML")


# ══════════════════════════════════════════════════
#  MENU NAVIGATION
# ══════════════════════════════════════════════════

@router.callback_query(F.data == "menu:main")
async def cb_main_menu(cb: CallbackQuery):
    await cb.message.edit_text(WELCOME, reply_markup=keyboards.main_menu_kb(), parse_mode="HTML")
    await cb.answer()


@router.callback_query(F.data == "menu:timer")
async def cb_timer(cb: CallbackQuery):
    await cb.answer("Yuklanmoqda…")
    await cb.message.edit_text(f"{EMOJI['timer']} Sessiyalar yuklanmoqda…", parse_mode="HTML")
    sessions = await api.get_next_sessions()
    text = formatters.format_next_sessions(sessions)
    await cb.message.edit_text(
        text,
        reply_markup=keyboards.back_to_menu_kb(),
        parse_mode="HTML"
    )


@router.callback_query(F.data == "menu:standings")
async def cb_standings_menu(cb: CallbackQuery):
    await cb.message.edit_text(
        f"{EMOJI['trophy']} <b>Reytinglar</b>\n\nQaysi reytingni ko'rmoqchisiz?",
        reply_markup=keyboards.standings_kb(),
        parse_mode="HTML"
    )
    await cb.answer()


@router.callback_query(F.data == "standings:drivers")
async def cb_driver_standings(cb: CallbackQuery):
    await cb.answer("Yuklanmoqda…")
    await cb.message.edit_text(f"{EMOJI['trophy']} Reyting yuklanmoqda…", parse_mode="HTML")
    standings = await api.get_driver_standings()
    text = formatters.format_driver_standings(standings)
    await cb.message.edit_text(
        text,
        reply_markup=keyboards.standings_kb(),
        parse_mode="HTML"
    )


@router.callback_query(F.data == "standings:constructors")
async def cb_constructor_standings(cb: CallbackQuery):
    await cb.answer("Yuklanmoqda…")
    await cb.message.edit_text(f"{EMOJI['trophy']} Reyting yuklanmoqda…", parse_mode="HTML")
    standings = await api.get_constructor_standings()
    text = formatters.format_constructor_standings(standings)
    await cb.message.edit_text(
        text,
        reply_markup=keyboards.standings_kb(),
        parse_mode="HTML"
    )


# ══════════════════════════════════════════════════
#  DRIVERS
# ══════════════════════════════════════════════════

@router.callback_query(F.data == "menu:drivers")
async def cb_drivers_menu(cb: CallbackQuery):
    await cb.answer("Yuklanmoqda…")
    await cb.message.edit_text(f"{EMOJI['driver']} Haydovchilar yuklanmoqda…", parse_mode="HTML")
    drivers = await api.get_all_drivers()
    await cb.message.edit_text(
        f"{EMOJI['driver']} <b>2025 Haydovchilar</b>\n\nBirini tanlang:",
        reply_markup=keyboards.drivers_list_kb(drivers),
        parse_mode="HTML"
    )


@router.callback_query(F.data.startswith("driver:"))
async def cb_driver_detail(cb: CallbackQuery):
    driver_id = cb.data.split(":", 1)[1]
    await cb.answer("Yuklanmoqda…")
    await cb.message.edit_text(f"{EMOJI['driver']} Haydovchi ma'lumotlari…", parse_mode="HTML")

    import asyncio
    drivers, standings = await asyncio.gather(
        api.get_all_drivers(),
        api.get_driver_standings()
    )

    driver  = next((d for d in drivers if d["driverId"] == driver_id), None)
    if not driver:
        await cb.message.edit_text("❌ Haydovchi topilmadi.", reply_markup=keyboards.back_to_menu_kb())
        return

    standing = next(
        (s for s in standings if s["Driver"]["driverId"] == driver_id), None
    )
    card = formatters.format_driver_card(driver, standing)
    await cb.message.edit_text(
        card,
        reply_markup=keyboards.driver_detail_kb(driver_id),
        parse_mode="HTML"
    )


@router.callback_query(F.data.startswith("dstats:"))
async def cb_driver_stats(cb: CallbackQuery):
    driver_id = cb.data.split(":", 1)[1]
    await cb.answer("Statistika yuklanmoqda…")
    await cb.message.edit_text(f"📊 {driver_id} statistikasi…", parse_mode="HTML")

    import asyncio
    drivers, standings, stats = await asyncio.gather(
        api.get_all_drivers(),
        api.get_driver_standings(),
        api.get_driver_season_stats(driver_id),
    )

    driver  = next((d for d in drivers if d["driverId"] == driver_id), None)
    if not driver:
        await cb.message.edit_text("❌ Topilmadi.", reply_markup=keyboards.back_to_menu_kb())
        return
    standing = next((s for s in standings if s["Driver"]["driverId"] == driver_id), None)

    card = formatters.format_driver_card(driver, standing, stats)
    await cb.message.edit_text(
        card,
        reply_markup=keyboards.driver_detail_kb(driver_id),
        parse_mode="HTML"
    )


# ══════════════════════════════════════════════════
#  TEAMS
# ══════════════════════════════════════════════════

@router.callback_query(F.data == "menu:teams")
async def cb_teams_menu(cb: CallbackQuery):
    await cb.answer("Yuklanmoqda…")
    constructors = await api.get_all_constructors()
    await cb.message.edit_text(
        f"{EMOJI['team']} <b>2025 Jamoalar</b>\n\nBirini tanlang:",
        reply_markup=keyboards.teams_list_kb(constructors),
        parse_mode="HTML"
    )


@router.callback_query(F.data.startswith("team:"))
async def cb_team_detail(cb: CallbackQuery):
    cid = cb.data.split(":", 1)[1]
    await cb.answer("Yuklanmoqda…")
    await cb.message.edit_text(f"{EMOJI['team']} Jamoa ma'lumotlari…", parse_mode="HTML")

    import asyncio
    constructors, standings = await asyncio.gather(
        api.get_all_constructors(),
        api.get_constructor_standings()
    )

    constructor = next((c for c in constructors if c["constructorId"] == cid), None)
    if not constructor:
        await cb.message.edit_text("❌ Jamoa topilmadi.", reply_markup=keyboards.back_to_menu_kb())
        return

    standing = next((s for s in standings if s["Constructor"]["constructorId"] == cid), None)
    card = formatters.format_constructor_card(constructor, standing)
    await cb.message.edit_text(
        card,
        reply_markup=keyboards.team_detail_kb(cid),
        parse_mode="HTML"
    )


# ══════════════════════════════════════════════════
#  HEAD-TO-HEAD
# ══════════════════════════════════════════════════

@router.callback_query(F.data == "menu:h2h")
async def cb_h2h_start(cb: CallbackQuery):
    await cb.answer("Yuklanmoqda…")
    drivers = await api.get_all_drivers()
    await cb.message.edit_text(
        f"{EMOJI['vs']} <b>Head-to-Head</b>\n\n1-haydovchini tanlang:",
        reply_markup=keyboards.h2h_select_first_kb(drivers),
        parse_mode="HTML"
    )


@router.callback_query(F.data.startswith("h2h_1:"))
async def cb_h2h_first(cb: CallbackQuery):
    first_id = cb.data.split(":", 1)[1]
    await cb.answer()
    drivers = await api.get_all_drivers()
    first = next((d for d in drivers if d["driverId"] == first_id), None)
    first_name = f"{first['givenName']} {first['familyName']}" if first else first_id

    await cb.message.edit_text(
        f"{EMOJI['vs']} <b>Head-to-Head</b>\n\n"
        f"✅ 1-haydovchi: <b>{first_name}</b>\n\n"
        f"Endi 2-haydovchini tanlang:",
        reply_markup=keyboards.h2h_select_second_kb(drivers, first_id),
        parse_mode="HTML"
    )


@router.callback_query(F.data.startswith("h2h_2:"))
async def cb_h2h_result(cb: CallbackQuery):
    _, first_id, second_id = cb.data.split(":")
    await cb.answer("Taqqoslanmoqda…")
    await cb.message.edit_text(f"{EMOJI['vs']} Statistika yuklanmoqda…", parse_mode="HTML")

    import asyncio
    drivers, stats = await asyncio.gather(
        api.get_all_drivers(),
        api.get_head_to_head(first_id, second_id),
    )

    d1 = next((d for d in drivers if d["driverId"] == first_id), {})
    d2 = next((d for d in drivers if d["driverId"] == second_id), {})

    text = formatters.format_h2h(d1, d2, stats)

    builder_kb_row = [
        ("🔄 Qayta", "menu:h2h"),
        (f"{EMOJI['menu']} Menyu", "menu:main"),
    ]
    from aiogram.utils.keyboard import InlineKeyboardBuilder
    from aiogram.types import InlineKeyboardButton
    b = InlineKeyboardBuilder()
    for label, cbd in builder_kb_row:
        b.button(text=label, callback_data=cbd)
    b.adjust(2)

    await cb.message.edit_text(text, reply_markup=b.as_markup(), parse_mode="HTML")
