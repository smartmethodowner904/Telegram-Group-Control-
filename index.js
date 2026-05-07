require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID;

/* ================= CHANNEL LINKS ================= */
const MAIN_CHANNEL = "https://t.me/+75BQ2Qw9UZI4OTM1";
const GLOBAL_CHANNEL = "https://t.me/Global_Method_Channel";

/* ================= WELCOME TEXT ================= */
function welcome(name) {
  return `
🎉 Welcome ${name}

👋 You are now in the group.

💬 Send message if you need help:
text / voice / photo / sticker / emoji / gif

Admin will reply soon 🚀
`;
}

/* ================= NEW MEMBER ================= */
bot.on("new_chat_members", async (ctx) => {
  try {
    const user = ctx.message.new_chat_members[0];
    const name = user.first_name;

    try {
      await ctx.deleteMessage(ctx.message.message_id);
    } catch {}

    const msg = await ctx.reply(
      welcome(name),
      Markup.inlineKeyboard([
        [
          Markup.button.url("🌍 Main Channel", MAIN_CHANNEL),
          Markup.button.url("🌐 Global Channel", GLOBAL_CHANNEL)
        ],
        [
          Markup.button.callback("✅ Joined", "joined_ok")
        ]
      ])
    );

    setTimeout(async () => {
      try {
        await ctx.deleteMessage(msg.message_id);
      } catch {}
    }, 120000);

  } catch (err) {
    console.log(err);
  }
});

/* ================= JOIN BUTTON ================= */
bot.action("joined_ok", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.reply("✅ Live chat activated 🚀");
});

/* ================= FORWARD SYSTEM ================= */
bot.on("message", async (ctx) => {
  try {
    const user = ctx.from;
    const name = user.first_name;

    const header =
`📩 NEW MESSAGE

👤 Name: ${name}
🆔 ID: ${user.id}

💬 Message:
`;

    if (ctx.message.text) {
      await ctx.telegram.sendMessage(ADMIN_ID, header + ctx.message.text);
    }

    else if (ctx.message.photo) {
      await ctx.telegram.sendMessage(ADMIN_ID, header + "[Photo]");
      await ctx.telegram.forwardMessage(ADMIN_ID, ctx.chat.id, ctx.message.message_id);
    }

    else if (ctx.message.voice) {
      await ctx.telegram.sendMessage(ADMIN_ID, header + "[Voice]");
      await ctx.telegram.forwardMessage(ADMIN_ID, ctx.chat.id, ctx.message.message_id);
    }

    else if (ctx.message.sticker) {
      await ctx.telegram.sendMessage(ADMIN_ID, header + "[Sticker]");
      await ctx.telegram.forwardMessage(ADMIN_ID, ctx.chat.id, ctx.message.message_id);
    }

    else {
      await ctx.telegram.forwardMessage(ADMIN_ID, ctx.chat.id, ctx.message.message_id);
    }

  } catch (e) {
    console.log(e);
  }
});

/* ================= START BOT ================= */
bot.launch({
  dropPendingUpdates: true
});

console.log("🚀 Bot is running...");
