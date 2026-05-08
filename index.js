const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8585925975:AAG4go4UJMTWf61Qh8c0Y3LtoPzpAcMOUZI");

const GROUPS = [
  -1002346718545,
  -1003996124468
];

/* ================= START (FIXED) ================= */

bot.start(async (ctx) => {
  return ctx.reply(
`👋 Welcome ${ctx.from.first_name}

⚠️ Please join our channels`,
    Markup.inlineKeyboard([
      [
        Markup.button.url(
          "📢 Main Channel",
          "https://t.me/+75BQ2Qw9UZI4OTM1"
        )
      ],
      [
        Markup.button.url(
          "🌍 Global Method Channel",
          "https://t.me/Global_Method_Channel"
        )
      ],
      [
        Markup.button.callback(
          "✅ Joined",
          "joined_ok"
        )
      ]
    ])
  );
});

/* ================= JOIN EVENT ================= */

bot.on("new_chat_members", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    try {
      await ctx.deleteMessage(ctx.message.message_id);
    } catch {}

    const user = ctx.message.new_chat_members[0];
    const name = user.first_name;

    const msg = await ctx.reply(
`🎊 Hey ${name}

👋 Welcome to Smart Method Chat

📌 Join all channels below to stay updated
🔥 Be Active & Enjoy`,
      Markup.inlineKeyboard([
        [
          Markup.button.url("📢 Main Channel", "https://t.me/+75BQ2Qw9UZI4OTM1")
        ],
        [
          Markup.button.url("🌍 Global Method Channel", "https://t.me/Global_Method_Channel")
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

/* ================= LEFT ================= */

bot.on("left_chat_member", async (ctx) => {
  try {
    if (!GROUPS.includes(ctx.chat.id)) return;
    await ctx.deleteMessage(ctx.message.message_id);
  } catch {}
});

/* ================= GROUP CLEAN + IGNORE COMMAND FIX ================= */

bot.on("message", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    /* ignore commands (VERY IMPORTANT FIX) */
    if (ctx.message.text && ctx.message.text.startsWith("/")) return;

    if (ctx.message.new_chat_title) {
      return ctx.deleteMessage(ctx.message.message_id);
    }

    if (ctx.message.new_chat_photo) {
      return ctx.deleteMessage(ctx.message.message_id);
    }

  } catch {}

});

/* ================= BUTTON ================= */

bot.action("joined_ok", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.reply("✅ Bot Unlock Successful");
});

/* ================= LAUNCH ================= */

bot.launch({
  dropPendingUpdates: true
});

console.log("🚀 Bot Running...");
