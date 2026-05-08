const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8585925975:AAG4go4UJMTWf61Qh8c0Y3LtoPzpAcMOUZI");

/* ================= GROUP LIST ================= */

const GROUPS = [
  -1002346718545,
  -1003996124468
];

/* ================= UTIL ================= */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ================= AUTO JOIN REQUEST APPROVE ================= */

bot.on("chat_join_request", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    // auto approve request
    await ctx.approveChatJoinRequest(ctx.from.id);

    const name = ctx.from.first_name;

    await ctx.telegram.sendMessage(
      ctx.from.id,
`🎉 Welcome ${name}

✅ Your join request has been approved
👋 You can now access the group`
    );

  } catch (err) {
    console.log("Join request error:", err);
  }

});

/* ================= GROUP WELCOME + ROTATE ================= */

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

`🔥 Hey ${name}
📌 Stay active & enjoy`,

`🚀 Hey ${name}
💬 Feel free to ask anything`,

`🎯 Hey ${name}
📢 Join our channels below`,

`✨ Hey ${name}
👑 You are now part of Smart Family`,

`📣 Hey ${name}
⚡ Don’t miss updates`,

`💡 Hey ${name}
📊 Learn & grow here`,

`🎁 Hey ${name}
🎉 Enjoy your stay`,

`🌍 Hey ${name}
🔥 Global community`,

`💬 Hey ${name}
📌 Be active always`,

`🚀 Hey ${name}
⚡ Let’s grow together`,

`🎊 Hey ${name}
👋 Happy to have you`,

`📢 Hey ${name}
🔥 Follow rules`,

`💡 Hey ${name}
📣 Stay connected`,

`🎯 Hey ${name}
👑 Smart Method Family`,

`✨ Hey ${name}
🚀 Explore opportunities`,

`📊 Hey ${name}
💬 Chat & learn`,

`🔥 Hey ${name}
📌 Important member`,

`🎊 Hey ${name}
👋 Welcome again`,

`🌟 Hey ${name}
💬 Enjoy Smart Method Chat`
];

    let index = 0;

    const msg = await ctx.reply(
      messages[0],
      Markup.inlineKeyboard([
        [
          Markup.button.url("📢 Main Channel", "https://t.me/+75BQ2Qw9UZI4OTM1")
        ],
        [
          Markup.button.url("🌍 Global Method Channel", "https://t.me/Global_Method_Channel")
        ]
      ])
    );

    let running = true;

    async function rotate() {

      while (running) {

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

        await sleep(3000);
      }
    }

    rotate();

    setTimeout(async () => {

      running = false;

      try {
        await ctx.deleteMessage(msg.message_id);
      } catch {}

    }, 120000);

  } catch (err) {
    console.log(err);
  }

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
`👋 Welcome ${ctx.from.first_name}`,
    Markup.inlineKeyboard([
      [Markup.button.url("📢 Main Channel", "https://t.me/+75BQ2Qw9UZI4OTM1")],
      [Markup.button.url("🌍 Global Method Channel", "https://t.me/Global_Method_Channel")],
      [Markup.button.callback("✅ Joined", "joined_ok")]
    ])
  );

});

/* ================= JOINED BUTTON ================= */

bot.action("joined_ok", async (ctx) => {

  await ctx.answerCbQuery();
  return ctx.reply("✅ Bot Unlock Successful");

});

/* ================= START BOT ================= */

bot.launch({
  dropPendingUpdates: true
});

console.log("🚀 Bot Running...");
