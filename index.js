const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8661744403:AAFvIQxQl9FBmUdxZCJm9ettf2KzAc1xHsA");

/* ================= ALLOWED GROUPS ================= */

const GROUPS = [
  -1002346718545,
  -1003996124468
];

/* ================= GROUP SYSTEM ================= */

bot.on("message", async (ctx) => {

  try {

    /* only work in selected groups */

    if (!GROUPS.includes(ctx.chat.id)) return;

    /* ================= JOIN MESSAGE ================= */

    if (ctx.message.new_chat_members) {

      /* delete telegram join message */

      try {
        await ctx.deleteMessage(ctx.message.message_id);
      } catch {}

      const user =
        ctx.message.new_chat_members[0];

      const name = user.first_name;

      /* welcome message */

      const msg = await ctx.reply(

`🎉 Welcome ${name}

👋 Welcome to our group!`,

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

    }

    /* ================= LEFT MESSAGE ================= */

    if (ctx.message.left_chat_member) {

      try {
        await ctx.deleteMessage(ctx.message.message_id);
      } catch {}

    }

  } catch (err) {
    console.log(err);
  }

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
