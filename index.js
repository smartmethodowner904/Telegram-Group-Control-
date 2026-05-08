const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8585925975:AAEOfStXgUt-CJ85r072WvjoxT9_cNRhONo");

/* ================= GROUPS ================= */

const GROUPS = [
  -1003527248014,
  -1003723410396
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
    console.log(err);
  }

}

/* ================= MESSAGE SYSTEM ================= */

bot.on("message", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    /* ================= JOIN EVENT ================= */

    if (ctx.message.new_chat_members) {

      try {
        await ctx.deleteMessage(ctx.message.message_id);
      } catch {}

      const user =
        ctx.message.new_chat_members[0];

      const name = user.first_name;

      const messages = [

`🎊 Hey ${name}
👋 Welcome to Smart Method Chat`,

`🔥 Hey ${name}
📌 Stay active & enjoy`,

`🚀 Hey ${name}
💬 Feel free to ask anything`,

`🎯 Hey ${name}
📢 Join our channels below`

      ];

      const msg = await ctx.reply(

        messages[0],

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
          ]

        ])

      );

      let running = true;
      let index = 0;

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

      setTimeout(async () => {

        running = false;

        try {
          await ctx.deleteMessage(
            msg.message_id
          );
        } catch {}

      }, 120000);

    }

    /* ================= DELETE LEFT ================= */

    if (ctx.message.left_chat_member) {

      try {
        await ctx.deleteMessage(
          ctx.message.message_id
        );
      } catch {}

    }

    /* ================= DELETE TITLE CHANGE ================= */

    if (ctx.message.new_chat_title) {

      try {
        await ctx.deleteMessage(
          ctx.message.message_id
        );
      } catch {}

    }

    /* ================= DELETE PHOTO CHANGE ================= */

    if (ctx.message.new_chat_photo) {

      try {
        await ctx.deleteMessage(
          ctx.message.message_id
        );
      } catch {}

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

    } catch {}

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
