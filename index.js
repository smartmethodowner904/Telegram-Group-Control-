const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8585925975:AAG4go4UJMTWf61Qh8c0Y3LtoPzpAcMOUZI");

/* ================= GROUPS ================= */

const GROUPS = [
  -1002346718545,
  -1003996124468
];

/* ================= CHANNEL IDS ================= */

const MAIN_CHANNEL_ID = -1003933615274;
const GLOBAL_CHANNEL_ID = -1003982412106;

/* ================= DEFAULT LINKS ================= */

let mainLink = "https://t.me/+75BQ2Qw9UZI4OTM1";
let globalLink = "https://t.me/Global_Method_Channel";

/* ================= SLEEP ================= */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ================= CREATE NEW INVITE LINKS ================= */

async function createLinks(ctx) {

  try {

    /* MAIN CHANNEL */

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

    /* GLOBAL CHANNEL */

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
    console.log("Invite Error:", err);
  }

}

/* ================= AUTO JOIN REQUEST APPROVE ================= */

bot.on("chat_join_request", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    await ctx.approveChatJoinRequest(
      ctx.from.id
    );

    const name = ctx.from.first_name;

    await ctx.telegram.sendMessage(
      ctx.from.id,

`🎉 Welcome ${name}

✅ Your join request approved
👋 You can now access the group`
    );

  } catch (err) {
    console.log(err);
  }

});

/* ================= WELCOME ================= */

bot.on("new_chat_members", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    /* delete join message */

    try {
      await ctx.deleteMessage(
        ctx.message.message_id
      );
    } catch {}

    const user =
      ctx.message.new_chat_members[0];

    const name = user.first_name;

    /* rotating messages */

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

    /* send welcome */

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

    /* rotating text */

    async function rotate() {

      while (running) {

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

        await sleep(3000);

      }

    }

    rotate();

    /* auto delete after 2 min */

    setTimeout(async () => {

      running = false;

      try {
        await ctx.deleteMessage(
          msg.message_id
        );
      } catch {}

    }, 120000);

  } catch (err) {
    console.log(err);
  }

});

/* ================= GENERATE BUTTON ================= */

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

/* ================= CLEAN SYSTEM ================= */

bot.on("message", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id))
      return;

    /* delete left msg */

    if (ctx.message.left_chat_member) {

      return ctx.deleteMessage(
        ctx.message.message_id
      );

    }

    /* delete title change */

    if (ctx.message.new_chat_title) {

      return ctx.deleteMessage(
        ctx.message.message_id
      );

    }

    /* delete photo change */

    if (ctx.message.new_chat_photo) {

      return ctx.deleteMessage(
        ctx.message.message_id
      );

    }

  } catch {}

});

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
