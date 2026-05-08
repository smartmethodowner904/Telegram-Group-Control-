const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8585925975:AAG4go4UJMTWf61Qh8c0Y3LtoPzpAcMOUZI");

const GROUPS = [
  -1002346718545,
  -1003996124468
];

/* ================= WELCOME EVENT ================= */

bot.on("new_chat_members", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    try {
      await ctx.deleteMessage(ctx.message.message_id);
    } catch {}

    const user = ctx.message.new_chat_members[0];
    const name = user.first_name;

    /* 20 ROTATING MESSAGES */
    const messages = [
`🎊 Hey ${name}
👋 Welcome to Smart Method Chat`,

`🔥 Hey ${name}
📌 Stay active & enjoy our community`,

`🚀 Hey ${name}
💬 Feel free to ask anything`,

`🎯 Hey ${name}
📢 Join all channels below`,

`✨ Hey ${name}
👑 You are now part of Smart Family`,

`📣 Hey ${name}
⚡ Don’t miss important updates`,

`💡 Hey ${name}
📊 Learn & grow with us`,

`🎁 Hey ${name}
🎉 Enjoy your stay here`,

`🧠 Hey ${name}
📌 Smart Method Chat welcomes you`,

`🌍 Hey ${name}
🔥 Global community awaits you`,

`💬 Hey ${name}
📢 Be respectful & active`,

`🚀 Hey ${name}
⚡ Let’s grow together`,

`🎊 Hey ${name}
👋 We are happy to see you`,

`📌 Hey ${name}
🔥 Follow all rules`,

`💡 Hey ${name}
📣 Stay connected always`,

`🎯 Hey ${name}
👑 Smart Method Chat family`,

`✨ Hey ${name}
🚀 Explore new opportunities`,

`📢 Hey ${name}
💬 Chat & enjoy`,

`🔥 Hey ${name}
📌 You are important here`,

`🎊 Hey ${name}
👋 Welcome once again to Smart Method Chat`
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

    /* CHANGE EVERY 3 SECONDS */
    const interval = setInterval(async () => {

      try {

        index = (index + 1) % messages.length;

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

      } catch {}

    }, 3000);

    /* AUTO DELETE AFTER 2 MIN */
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

/* ================= CLEAN SYSTEM ================= */

bot.on("message", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    if (ctx.message.new_chat_title) {
      return ctx.deleteMessage(ctx.message.message_id);
    }

    if (ctx.message.new_chat_photo) {
      return ctx.deleteMessage(ctx.message.message_id);
    }

    if (ctx.message.left_chat_member) {
      return ctx.deleteMessage(ctx.message.message_id);
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
