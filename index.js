const { Telegraf } = require("telegraf");
const bot = new Telegraf("8661744403:AAGwRX-ETaCEe2_5CHkSRIRB41Q8JnP7qe4");

// memory DB
const users = new Map();

/* ================= SAVE USER ================= */
bot.on("message", (ctx) => {
  try {
    const id = ctx.from.id;
    const username = ctx.from.username;

    users.set(username, id); // save mapping
  } catch {}
});

/* ================= GET USER ID ================= */
function getUserId(username) {
  return users.get(username);
}

/* ================= BAN ================= */
bot.command("ban", async (ctx) => {
  const text = ctx.message.text.split(" ");

  if (!text[1]) return ctx.reply("❌ Use: /ban @username");

  const username = text[1].replace("@", "");
  const userId = getUserId(username);

  if (!userId) {
    return ctx.reply("❌ User not found (must message bot first)");
  }

  await ctx.telegram.banChatMember(ctx.chat.id, userId);

  ctx.reply(`✅ @${username} banned`);
});

/* ================= MUTE ================= */
bot.command("mute", async (ctx) => {
  const text = ctx.message.text.split(" ");

  if (!text[1]) return ctx.reply("❌ Use: /mute @username");

  const username = text[1].replace("@", "");
  const userId = getUserId(username);

  if (!userId) {
    return ctx.reply("❌ User not found (must message first)");
  }

  await ctx.telegram.restrictChatMember(ctx.chat.id, userId, {
    permissions: { can_send_messages: false }
  });

  ctx.reply(`🔇 @${username} muted`);
});

/* ================= UNMUTE ================= */
bot.command("unmute", async (ctx) => {
  const text = ctx.message.text.split(" ");

  const username = text[1].replace("@", "");
  const userId = getUserId(username);

  if (!userId) return ctx.reply("❌ User not found");

  await ctx.telegram.restrictChatMember(ctx.chat.id, userId, {
    permissions: {
      can_send_messages: true,
      can_send_media_messages: true,
      can_send_other_messages: true
    }
  });

  ctx.reply(`🔊 @${username} unmuted`);
});

/* ================= START ================= */
bot.launch();

console.log("Bot running...");
