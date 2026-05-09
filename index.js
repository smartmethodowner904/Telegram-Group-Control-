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

/* ================= PREMIUM EMOJIS ================= */

const EMOJIS = {
  fire: `<tg-emoji emoji-id="5368324170671202286">🔥</tg-emoji>`,
  wave: `<tg-emoji emoji-id="5222102031224074514">👋</tg-emoji>`,
  pin: `<tg-emoji emoji-id="5348140027698227662">📌</tg-emoji>`,
  rocket: `<tg-emoji emoji-id="5350507166539783758">🚀</tg-emoji>`,
  target: `<tg-emoji emoji-id="5357197206953169862">🎯</tg-emoji>`,
  crown: `<tg-emoji emoji-id="5359459605665543692">👑</tg-emoji>`,
  gift: `<tg-emoji emoji-id="5361735750968679136">🎁</tg-emoji>`,
  global: `<tg-emoji emoji-id="5370869711888194012">🌍</tg-emoji>`,
  msg: `<tg-emoji emoji-id="5443038326535759644">💬</tg-emoji>`,
  spark: `<tg-emoji emoji-id="5224378213548571173">✨</tg-emoji>`,
  party: `<tg-emoji emoji-id="5269470000000000001">🎊</tg-emoji>`,
  megaphone: `<tg-emoji emoji-id="5355096209521817726">📢</tg-emoji>`,
  generate: `<tg-emoji emoji-id="5386367538735104399">♻️</tg-emoji>`,
  done: `<tg-emoji emoji-id="5237699328848219334">✅</tg-emoji>`
};

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

    const members =
      ctx.message.new_chat_members ||
      ctx.update.message.new_chat_members;

    if (members) {

      try {
        await ctx.deleteMessage(
          ctx.message.message_id
        );
      } catch {}

      await createLinks(ctx);

      const user = members[0];
      const name = user.first_name;

      const messages = [

`${EMOJIS.party} Hey ${name}
${EMOJIS.wave} Welcome to Smart Method Chat`,

`${EMOJIS.fire} Hey ${name}
${EMOJIS.pin} Stay active & enjoy`,

`${EMOJIS.rocket} Hey ${name}
${EMOJIS.msg} Feel free to ask anything`,

`${EMOJIS.target} Hey ${name}
${EMOJIS.megaphone} Join our channels below`,

`${EMOJIS.spark} Hey ${name}
${EMOJIS.crown} You are now part of Smart Family`,

`${EMOJIS.global} Hey ${name}
${EMOJIS.fire} Global community`,

`${EMOJIS.gift} Hey ${name}
🎉 Enjoy your stay`,

`${EMOJIS.party} Hey ${name}
${EMOJIS.wave} Welcome again`

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
                  text: `${EMOJIS.megaphone} Main Channel`,
                  url: mainLink
                }
              ],

              [
                {
                  text: `${EMOJIS.global} Global Channel`,
                  url: globalLink
                }
              ],

              [
                {
                  text: `${EMOJIS.generate} Generate`,
                  callback_data: "generate_links"
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
                        text: `${EMOJIS.megaphone} Main Channel`,
                        url: mainLink
                      }
                    ],

                    [
                      {
                        text: `${EMOJIS.global} Global Channel`,
                        url: globalLink
                      }
                    ],

                    [
                      {
                        text: `${EMOJIS.generate} Generate`,
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
                `${EMOJIS.megaphone} Main Channel`,
              url: mainLink
            }
          ],

          [
            {
              text:
                `${EMOJIS.global} Global Channel`,
              url: globalLink
            }
          ],

          [
            {
              text:
                `${EMOJIS.done} Create Done`,
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

`${EMOJIS.wave} Welcome ${ctx.from.first_name}`,

    {
      parse_mode: "HTML",

      reply_markup: {
        inline_keyboard: [

          [
            {
              text:
                `${EMOJIS.megaphone} Main Channel`,
              url: mainLink
            }
          ],

          [
            {
              text:
                `${EMOJIS.global} Global Channel`,
              url: globalLink
            }
          ],

          [
            {
              text:
                `${EMOJIS.generate} Generate`,
              callback_data:
                "generate_links"
            }
          ],

          [
            {
              text:
                `${EMOJIS.done} Joined`,
              callback_data:
                "joined_ok"
            }
          ]

        ]
      }
    }

  );

});

/* ================= JOINED ================= */

bot.action(
  "joined_ok",
  async (ctx) => {

    await ctx.answerCbQuery();

    return ctx.reply(
      `${EMOJIS.done} Bot Unlock Successful`,
      {
        parse_mode: "HTML"
      }
    );

  }
);

/* ================= BOT START ================= */

bot.launch({
  dropPendingUpdates: true
});

console.log("🚀 Bot Running...");
