const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8585925975:AAG4go4UJMTWf61Qh8c0Y3LtoPzpAcMOUZI");

const GROUPS = [
  -1002346718545,
  -1003996124468
];

/* ================= WELCOME ROTATING MESSAGE ================= */

bot.on("new_chat_members", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    try {
      await ctx.deleteMessage(ctx.message.message_id);
    } catch {}

    const user = ctx.message.new_chat_members[0];
    const name = user.first_name;

    const messages = [
`🎊 Hey ${name}
👋 Welcome to Smart Method Chat`,

`📌 Join our official channels below
🔥 Stay Active & Updated`,

`🚀 Enjoy your time here
💬 Feel free to interact!`
    ];

    let index = 0;

    const msg = await ctx.reply(
      messages[index],
      Markup.inlineKeyboard([
        [
          Markup.button.url("📢 Main Channel", "https://t.me/+75BQ2Qw9UZI4OTM1")
        ],
        [
          Markup.button.url("🌍 Global Method Channel", "https://t.me/Global_Method_Channel")
        ]
      ])
    );

    /* change message every 3 sec */
    const interval = setInterval(async () => {
      try {
        index++;
        if (index >= messages.length) index = 0;

        await ctx.telegram.editMessageText(
          ctx.chat.id,
          msg.message_id,
          undefined,
          messages[index],
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "📢 Main Channel", url: "https://t.me/+75BQ2Qw9UZI4OTM1" }
                ],
                [
                  { text: "🌍 Global Method Channel", url: "https://t.me/Global_Method_Channel" }
                ]
              ]
            }
          }
        );

      } catch (e) {}
    }, 3000);

    /* auto delete after 2 minutes */
    setTimeout(async () => {
      clearInterval(interval);
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

/* ================= START ================= */

bot.start(async (ctx) => {

  return ctx.reply(
`👋 Welcome ${ctx.from.first_name}

⚠️ Please join our channels`,
    Markup.inlineKeyboard([
      [
        Markup.button.url("📢 Main Channel", "https://t.me/+75BQ2Qw9UZI4OTM1")
      ],
      [
        Markup.button.url("🌍 Global Method Channel", "https://t.me/Global_Method_Channel")
      ],
      [
        Markup.button.callback("✅ Joined", "joined_ok")
      ]
    ])
  );

});

bot.action("joined_ok", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.reply("✅ Bot Unlock Successful");
});

bot.launch({
  dropPendingUpdates: true
});

console.log("🚀 Bot Running...");
