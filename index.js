const { Telegraf } = require("telegraf");

/* ================= BOT TOKEN HERE ================= */
const bot = new Telegraf("8661744403:AAGwRX-ETaCEe2_5CHkSRIRB41Q8JnP7qe4");

/* ================= START ================= */
bot.start((ctx) => {
  ctx.reply("🚀 Bot is alive and working!");
});

/* ================= GET USER ================= */
function getUser(ctx) {
  if (ctx.message?.reply_to_message) {
    return ctx.message.reply_to_message.from.id;
  }

  const parts = ctx.message.text.split(" ");
  return parts[1] || null;
}

/* ================= BAN ================= */
bot.command("ban", async (ctx) => {
  try {
    const user = getUser(ctx);
    if (!user) return ctx.reply("❌ Reply or use /ban user_id");

    await ctx.telegram.banChatMember(ctx.chat.id, user);
    ctx.reply("✅ User banned");
  } catch (e) {
    console.log(e);
    ctx.reply("❌ Ban failed");
  }
});

/* ================= UNBAN ================= */
bot.command("unban", async (ctx) => {
  try {
    const user = getUser(ctx);
    if (!user) return ctx.reply("❌ Reply or use /unban user_id");

    await ctx.telegram.unbanChatMember(ctx.chat.id, user);
    ctx.reply("✅ User unbanned");
  } catch (e) {
    console.log(e);
    ctx.reply("❌ Unban failed");
  }
});

/* ================= MUTE ================= */
bot.command("mute", async (ctx) => {
  try {
    const user = getUser(ctx);
    if (!user) return ctx.reply("❌ Reply or use /mute user_id");

    await ctx.telegram.restrictChatMember(ctx.chat.id, user, {
      permissions: {
        can_send_messages: false
      }
    });

    ctx.reply("🔇 User muted");
  } catch (e) {
    console.log(e);
    ctx.reply("❌ Mute failed");
  }
});

/* ================= UNMUTE ================= */
bot.command("unmute", async (ctx) => {
  try {
    const user = getUser(ctx);
    if (!user) return ctx.reply("❌ Reply or use /unmute user_id");

    await ctx.telegram.restrictChatMember(ctx.chat.id, user, {
      permissions: {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true
      }
    });

    ctx.reply("🔊 User unmuted");
  } catch (e) {
    console.log(e);
    ctx.reply("❌ Unmute failed");
  }
});

/* ================= ERROR ================= */
bot.catch((err) => console.log("Error:", err));

/* ================= FIX ================= */
bot.launch({
  dropPendingUpdates: true
});

console.log("🚀 Bot Running...");
