const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8585925975:AAEBTJeK8kg82XiJoJ4-Cs6xe-Wi2Bjbq1I");

/* ================= GROUPS ================= */

const GROUPS = [
  -1002346718545,
  -1003994441271
];

/* ================= CHANNEL IDS ================= */

const MAIN_CHANNEL_ID = -1002315458574;
const GLOBAL_CHANNEL_ID = -1002510081290;

/* ================= DEFAULT LINKS ================= */

let mainLink = "https://t.me/+75BQ2Qw9UZI4OTM1";
let globalLink = "https://t.me/Global_Method_Channel";

/* ================= SLEEP ================= */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ================= CREATE LINKS ================= */

async function createLinks(ctx) {

  try {

    const mainInvite =
      await ctx.telegram.createChatInviteLink(
        MAIN_CHANNEL_ID,
        {
          expire_date:
            Math.floor(Date.now() / 1000) + 3600,
          member_limit: 1
        }
      );

    mainLink = mainInvite.invite_link;

  } catch (err) {
    console.log("Main link error");
  }

  try {

    const globalInvite =
      await ctx.telegram.createChatInviteLink(
        GLOBAL_CHANNEL_ID,
        {
          expire_date:
            Math.floor(Date.now() / 1000) + 3600,
          member_limit: 1
        }
      );

    globalLink = globalInvite.invite_link;

  } catch (err) {
    console.log("Global link error");
  }

}

/* ================= AUTO APPROVE ================= */

bot.on("chat_join_request", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id))
      return;

    await ctx.approveChatJoinRequest(
      ctx.from.id
    );

  } catch (err) {
    console.log(err);
  }

});

/* ================= MESSAGE SYSTEM ================= */

bot.on("message", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id))
      return;

    /* ================= JOIN DETECT FIX ================= */

    const members =
      ctx.message.new_chat_members ||
      ctx.update.message.new_chat_members;

    if (members) {

      try {
        await ctx.deleteMessage(
          ctx.message.message_id
        );
      } catch {}

      /* create fresh links */

      await createLinks(ctx);

      const user = members[0];

      const name = user.first_name;

      /* PREMIUM EMOJI */

      const premiumEmoji =
`<tg-emoji emoji-id="5368324170671202286">🔥</tg-emoji>`;

      const messages = [

`${premiumEmoji} Hey ${name}
👋 Welcome to Smart Method Chat`,

`${premiumEmoji} Hey ${name}
📌 Stay active & enjoy`,

`${premiumEmoji} Hey ${name}
💬 Feel free to ask anything`,

`${premiumEmoji} Hey ${name}
📢 Join our channels below`,

`${premiumEmoji} Hey ${name}
👑 You are now part of Smart Family`,

`${premiumEmoji} Hey ${name}
⚡ Don’t miss updates`,

`${premiumEmoji} Hey ${name}
📊 Learn & grow here`,

`${premiumEmoji} Hey ${name}
🎉 Enjoy your stay`,

`${premiumEmoji} Hey ${name}
🔥 Global community`,

`${premiumEmoji} Hey ${name}
📌 Be active always`,

`${premiumEmoji} Hey ${name}
⚡ Let’s grow together`,

`${premiumEmoji} Hey ${name}
👋 Happy to have you`,

`${premiumEmoji} Hey ${name}
🔥 Follow rules`,

`${premiumEmoji} Hey ${name}
📣 Stay connected`,

`${premiumEmoji} Hey ${name}
👑 Smart Method Family`,

`${premiumEmoji} Hey ${name}
🚀 Explore opportunities`,

`${premiumEmoji} Hey ${name}
💬 Chat & learn`,

`${premiumEmoji} Hey ${name}
📌 Important member`,

`${premiumEmoji} Hey ${name}
👋 Welcome again`,

`${premiumEmoji} Hey ${name}
💬 Enjoy Smart Method Chat`

      ];

      let index = 0;

      const msg = await ctx.reply(

        messages[0],

        {
          parse_mode: "HTML",

          reply_markup: {
            inline_keyboard: [

              [
                {
                  text: "📢 Main Channel",
                  url: mainLink
                }
              ],

              [
                {
                  text:
                    "🌍 Global Method Channel",
                  url: globalLink
                }
              ],

              [
                {
                  text:
                    "♻️ Generate",
                  callback_data:
                    "generate_links"
                }
              ]

            ]
          }
        }

      );

      let running = true;

      async function rotate() {

        while (running) {

          await sleep(3000);

          try {

            index =
              (index + 1) % messages.length;

            await ctx.telegram.editMessageText(

              ctx.chat.id,
              msg.message_id,
              undefined,
              messages[index],

              {
                parse_mode: "HTML",

                reply_markup: {
                  inline_keyboard: [

                    [
                      {
                        text: "📢 Main Channel",
                        url: mainLink
                      }
                    ],

                    [
                      {
                        text:
                          "🌍 Global Method Channel",
                        url: globalLink
                      }
                    ],

                    [
                      {
                        text:
                          "♻️ Generate",
                        callback_data:
                          "generate_links"
                      }
                    ]

                  ]
                }
              }

            );

          } catch {}

        }

      }

      rotate();

      /* auto delete */

      setTimeout(async () => {

        running = false;

        try {
          await ctx.deleteMessage(
            msg.message_id
          );
        } catch {}

      }, 120000);

    }

    /* ================= LEFT MSG ================= */

    if (ctx.message.left_chat_member) {

      return ctx.deleteMessage(
        ctx.message.message_id
      );

    }

    /* ================= TITLE CHANGE ================= */

    if (ctx.message.new_chat_title) {

      return ctx.deleteMessage(
        ctx.message.message_id
      );

    }

    /* ================= PHOTO CHANGE ================= */

    if (ctx.message.new_chat_photo) {

      return ctx.deleteMessage(
        ctx.message.message_id
      );

    }

  } catch (err) {
    console.log(err);
  }

});

/* ================= GENERATE ================= */

bot.action(
  "generate_links",
  async (ctx) => {

    try {

      await ctx.answerCbQuery(
        "Generating..."
      );

      await createLinks(ctx);

      await ctx.editMessageReplyMarkup({

        inline_keyboard: [

          [
            {
              text:
                "📢 Main Channel",
              url: mainLink
            }
          ],

          [
            {
              text:
                "🌍 Global Method Channel",
              url: globalLink
            }
          ],

          [
            {
              text:
                "✅ Create Done",
              callback_data:
                "generate_links"
            }
          ]

        ]

      });

    } catch (err) {
      console.log(err);
    }

  }
);

/* ================= START ================= */

bot.start(async (ctx) => {

  return ctx.reply(

`👋 Welcome ${ctx.from.first_name}`,

    Markup.inlineKeyboard([

      [
        Markup.button.url(
          "📢 Main Channel",
          mainLink
        )
      ],

      [
        Markup.button.url(
          "🌍 Global Method Channel",
          globalLink
        )
      ],

      [
        Markup.button.callback(
          "♻️ Generate",
          "generate_links"
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

/* ================= JOINED ================= */

bot.action(
  "joined_ok",
  async (ctx) => {

    await ctx.answerCbQuery();

    return ctx.reply(
      "✅ Bot Unlock Successful"
    );

  }
);

/* ================= BOT START ================= */

bot.launch({
  dropPendingUpdates: true
});

console.log("🚀 Bot Running...");
