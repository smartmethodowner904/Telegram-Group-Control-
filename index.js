const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8661744403:AAH2rhT_U97AykZC7yNXwFjuDKiCirCXEXU");

const ADMIN_ID = 8136997138;

/* ================= GROUP WELCOME ================= */

bot.on("new_chat_members", async (ctx) => {
  try {

    const user = ctx.message.new_chat_members[0];
    const name = user.first_name;

    /* delete telegram join message */
    try {
      await ctx.deleteMessage(ctx.message.message_id);
    } catch {}

    /* welcome message */
    const msg = await ctx.reply(
`🎉 Welcome ${name}

👋 Welcome to our group!
Feel free to ask anything 🚀`,

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

    /* auto delete after 3 min */
    setTimeout(async () => {
      try {
        await ctx.deleteMessage(msg.message_id);
      } catch {}
    }, 180000);

  } catch (err) {
    console.log(err);
  }
});

/* ================= START ================= */

bot.start(async (ctx) => {

  return ctx.reply(
`👋 Welcome ${ctx.from.first_name}

⚠️ You must join channels to use this bot`,

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
`✅ Thank you!

💬 You can now send message to bot.

If you have any problem,
send text / voice / sticker / photo / gif 🚀`
  );
});

/* ================= USER MESSAGE TO ADMIN ================= */

bot.on("message", async (ctx) => {

  try {

    /* ignore admin reply state */
    if (ctx.from.id == ADMIN_ID && replyState[ADMIN_ID]) {
      return;
    }

    /* ignore commands */
    if (ctx.message.text && ctx.message.text.startsWith("/")) {
      return;
    }

    const user = ctx.from;

    const header =
`📩 NEW USER MESSAGE

👤 Name: ${user.first_name}
🆔 ID: ${user.id}`;

    /* TEXT */
    if (ctx.message.text) {

      await ctx.telegram.sendMessage(
        ADMIN_ID,

`${header}

💬 Message:
${ctx.message.text}`,

        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "💬 Reply",
              `reply_${user.id}`
            )
          ]
        ])
      );

    }

    /* OTHER MEDIA */
    else {

      await ctx.telegram.sendMessage(
        ADMIN_ID,
        `${header}

📎 User sent media`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "💬 Reply",
              `reply_${user.id}`
            )
          ]
        ])
      );

      await ctx.telegram.forwardMessage(
        ADMIN_ID,
        ctx.chat.id,
        ctx.message.message_id
      );
    }

    return ctx.reply(
      "✅ Your message has been sent to admin"
    );

  } catch (err) {
    console.log(err);
  }
});

/* ================= ADMIN REPLY SYSTEM ================= */

const replyState = {};

/* reply button */

bot.action(/reply_(.+)/, async (ctx) => {

  if (ctx.from.id != ADMIN_ID) {
    return;
  }

  const userId = ctx.match[1];

  replyState[ADMIN_ID] = userId;

  return ctx.reply(
    "✍️ Please enter your reply message:"
  );
});

/* admin send reply */

bot.on("text", async (ctx) => {

  if (ctx.from.id != ADMIN_ID) {
    return;
  }

  const adminId = ctx.from.id;

  if (!replyState[adminId]) {
    return;
  }

  const userId = replyState[adminId];

  const text = ctx.message.text;

  delete replyState[adminId];

  const now = new Date().toLocaleString(
    "en-US",
    {
      timeZone: "Asia/Dhaka"
    }
  );

  await ctx.telegram.sendMessage(
    userId,

`📩 You have a reply from Admin

🆔 Admin ID: ${ADMIN_ID}

💬 Message:
${text}

🕒 Bangladesh Time:
${now}`,

    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "↩ Reply Back",
          "reply_back"
        )
      ]
    ])
  );

  return ctx.reply(
    "✅ Reply sent to user"
  );
});

/* ================= USER REPLY BACK ================= */

bot.action("reply_back", async (ctx) => {

  await ctx.answerCbQuery();

  return ctx.reply(
    "💬 Send your message again to contact admin"
  );
});

/* ================= START BOT ================= */

bot.launch({
  dropPendingUpdates: true
});

console.log("🚀 Bot is running...");
