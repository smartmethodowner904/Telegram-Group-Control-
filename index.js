const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8585925975:AAG4go4UJMTWf61Qh8c0Y3LtoPzpAcMOUZI");

/* ================= ALLOWED GROUPS ================= */

const GROUPS = [
  -1002346718545,
  -1003996124468
];

/* ================= JOIN EVENT ================= */

bot.on("new_chat_members", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    /* delete telegram join message */

    try {
      await ctx.deleteMessage(ctx.message.message_id);
    } catch {}

    const user =
      ctx.message.new_chat_members[0];

    const name = user.first_name;

    /* welcome message */

    const msg = await ctx.reply(

`🎊 Hey ${name}

👋 Welcome to Smart Method Chat

📌 Join all channels below to stay updated
🔥 Be Active & Enjoy`,

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
        ]
      ])

    );

    /* auto delete after 2 min */

    setTimeout(async () => {

      try {
        await ctx.deleteMessage(msg.message_id);
      } catch {}

    }, 120000);

  } catch (err) {
    console.log(err);
  }

});

/* ================= LEFT EVENT ================= */

bot.on("left_chat_member", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    await ctx.deleteMessage(ctx.message.message_id);

  } catch {}

});

/* ================= DELETE GROUP UPDATE MESSAGE ================= */

bot.on("message", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    /* group title changed */

    if (ctx.message.new_chat_title) {

      await ctx.deleteMessage(
        ctx.message.message_id
      );

    }

    /* group photo changed */

    if (ctx.message.new_chat_photo) {

      await ctx.deleteMessage(
        ctx.message.message_id
      );

    }

  } catch {}

});

/* ================= START ================= */

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

/* ================= JOINED BUTTON ================= */

bot.action("joined_ok", async (ctx) => {

  await ctx.answerCbQuery();

  return ctx.reply(
    "✅ Bot Unlock Successful"
  );

});

/* ================= START BOT ================= */

bot.launch({
  dropPendingUpdates: true
});

console.log("🚀 Bot Running...");
