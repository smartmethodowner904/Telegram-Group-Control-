const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8661744403:AAH2rhT_U97AykZC7yNXwFjuDKiCirCXEXU");

const ADMIN_ID = 8136997138;

/* ================= MEMORY ================= */

const supportUsers = {};
const replyState = {};

/* ================= GROUP JOIN ================= */

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

    /* auto delete */

    setTimeout(async () => {

      try {
        await ctx.deleteMessage(msg.message_id);
      } catch {}

    }, 180000);

  } catch (err) {
    console.log(err);
  }

});

/* ================= MEMBER LEFT ================= */

bot.on("left_chat_member", async (ctx) => {

  try {

    await ctx.deleteMessage(ctx.message.message_id);

  } catch {}

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

/* ================= JOIN BUTTON ================= */

bot.action("joined_ok", async (ctx) => {

  await ctx.answerCbQuery();

  return ctx.reply(

`✅ Thank you!

💬 You can now send message to bot.

If you have any problem,
send text / voice / sticker / photo / gif 🚀`,

    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "🎧 Admin Support 24/7",
          "support_system"
        )
      ]
    ])

  );

});

/* ================= SUPPORT BUTTON ================= */

bot.action("support_system", async (ctx) => {

  await ctx.answerCbQuery();

  supportUsers[ctx.from.id] = true;

  return ctx.reply(

`📩 Please send your message / photo / video / voice / sticker`

  );

});

/* ================= USER MESSAGE ================= */

bot.on("message", async (ctx) => {

  try {

    const userId = ctx.from.id;

    /* ignore admin */

    if (userId == ADMIN_ID) return;

    /* ignore commands */

    if (
      ctx.message.text &&
      ctx.message.text.startsWith("/")
    ) {
      return;
    }

    /* only support users */

    if (!supportUsers[userId]) {

      return ctx.reply(

`⚠️ Please click Admin Support 24/7 button first`,

        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "🎧 Admin Support 24/7",
              "support_system"
            )
          ]
        ])

      );

    }

    const user = ctx.from;

    const info =

`📩 NEW USER MESSAGE

👤 Name: ${user.first_name}
🆔 ID: ${user.id}`;

    /* ================= TEXT ================= */

    if (ctx.message.text) {

      await ctx.telegram.sendMessage(

        ADMIN_ID,

`${info}

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

    /* ================= PHOTO ================= */

    else if (ctx.message.photo) {

      const file =
        ctx.message.photo[
          ctx.message.photo.length - 1
        ].file_id;

      await ctx.telegram.sendPhoto(

        ADMIN_ID,
        file,
        {
          caption: info,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "💬 Reply",
                  callback_data:
                    `reply_${user.id}`
                }
              ]
            ]
          }
        }

      );

    }

    /* ================= VIDEO ================= */

    else if (ctx.message.video) {

      await ctx.telegram.sendVideo(

        ADMIN_ID,
        ctx.message.video.file_id,
        {
          caption: info,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "💬 Reply",
                  callback_data:
                    `reply_${user.id}`
                }
              ]
            ]
          }
        }

      );

    }

    /* ================= STICKER ================= */

    else if (ctx.message.sticker) {

      await ctx.telegram.sendSticker(
        ADMIN_ID,
        ctx.message.sticker.file_id
      );

      await ctx.telegram.sendMessage(

        ADMIN_ID,

info,

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

    /* ================= VOICE ================= */

    else if (ctx.message.voice) {

      await ctx.telegram.sendVoice(
        ADMIN_ID,
        ctx.message.voice.file_id
      );

      await ctx.telegram.sendMessage(

        ADMIN_ID,

info,

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

    return ctx.reply(
      "✅ Your message has been sent to admin"
    );

  } catch (err) {
    console.log(err);
  }

});

/* ================= REPLY BUTTON ================= */

bot.action(/reply_(.+)/, async (ctx) => {

  try {

    if (ctx.from.id != ADMIN_ID) return;

    const userId = ctx.match[1];

    replyState[ADMIN_ID] = userId;

    await ctx.answerCbQuery();

    return ctx.reply(
      "✍️ Please enter your reply message:"
    );

  } catch (err) {
    console.log(err);
  }

});

/* ================= ADMIN REPLY ================= */

bot.on("text", async (ctx) => {

  try {

    if (ctx.from.id != ADMIN_ID) return;

    if (!replyState[ADMIN_ID]) return;

    const userId = replyState[ADMIN_ID];

    const text = ctx.message.text;

    delete replyState[ADMIN_ID];

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
            "support_system"
          )
        ]
      ])

    );

    return ctx.reply(
      "✅ Reply sent successfully"
    );

  } catch (err) {
    console.log(err);
  }

});

/* ================= START BOT ================= */

bot.launch({
  dropPendingUpdates: true
});

console.log("🚀 Bot is running...");. 
