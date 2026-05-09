const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8585925975:AAEBTJeK8kg82XiJoJ4-Cs6xe-Wi2Bjbq1I");

/* ================= PREMIUM EMOJI ================= */
const EMOJI_ID = "5294000307074790591";
const EMOJI_CHAR = "⭐";

/* ================= GROUPS ================= */
const GROUPS = [
  -1002346718545,
  -1003527248014
];

/* ================= CHANNEL IDS ================= */
const MAIN_CHANNEL_ID = -1002315458574;
const GLOBAL_CHANNEL_ID = -1002510081290;

/* ================= LINKS ================= */
let mainLink = "https://t.me/+75BQ2Qw9UZI4OTM1";
let globalLink = "https://t.me/Global_Method_Channel";

/* ================= SLEEP ================= */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ================= CREATE LINKS ================= */
async function createLinks(ctx) {
  try {
    const mainInvite = await ctx.telegram.createChatInviteLink(
      MAIN_CHANNEL_ID,
      {
        expire_date: Math.floor(Date.now() / 1000) + 3600,
        member_limit: 1
      }
    );
    mainLink = mainInvite.invite_link;
  } catch {}

  try {
    const globalInvite = await ctx.telegram.createChatInviteLink(
      GLOBAL_CHANNEL_ID,
      {
        expire_date: Math.floor(Date.now() / 1000) + 3600,
        member_limit: 1
      }
    );
    globalLink = globalInvite.invite_link;
  } catch {}
}

/* ================= NEW MEMBER ================= */
bot.on("new_chat_members", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    try {
      await ctx.deleteMessage(ctx.message.message_id);
    } catch {}

    await createLinks(ctx);

    const user = ctx.message.new_chat_members[0];
    const name = user.first_name;

    const messages = [

`🎊 Hey ${name} ${EMOJI_CHAR}
👋 Welcome to Smart Method Chat`,

`🔥 Hey ${name} ${EMOJI_CHAR}
📌 Stay active & enjoy`,

`🚀 Hey ${name} ${EMOJI_CHAR}
💬 Feel free to ask anything`,

`🎯 Hey ${name} ${EMOJI_CHAR}
📢 Join our channels below`,

`✨ Hey ${name} ${EMOJI_CHAR}
👑 You are part of Smart Family`,

`📣 Hey ${name} ${EMOJI_CHAR}
⚡ Don’t miss updates`,

`💡 Hey ${name} ${EMOJI_CHAR}
📊 Learn & grow here`,

`🎁 Hey ${name} ${EMOJI_CHAR}
🎉 Enjoy your stay`,

`🌍 Hey ${name} ${EMOJI_CHAR}
🔥 Global community`,

`💬 Hey ${name} ${EMOJI_CHAR}
📌 Be active always`,

`🚀 Hey ${name} ${EMOJI_CHAR}
⚡ Let’s grow together`,

`🎊 Hey ${name} ${EMOJI_CHAR}
👋 Happy to have you`,

`📢 Hey ${name} ${EMOJI_CHAR}
🔥 Follow rules`,

`💡 Hey ${name} ${EMOJI_CHAR}
📣 Stay connected`,

`🎯 Hey ${name} ${EMOJI_CHAR}
👑 Smart Method Family`,

`✨ Hey ${name} ${EMOJI_CHAR}
🚀 Explore opportunities`,

`📊 Hey ${name} ${EMOJI_CHAR}
💬 Chat & learn`,

`🔥 Hey ${name} ${EMOJI_CHAR}
📌 Important member`,

`🎊 Hey ${name} ${EMOJI_CHAR}
👋 Welcome again`,

`🌟 Hey ${name} ${EMOJI_CHAR}
💬 Enjoy Smart Method Chat`

    ];

    function build(text) {

      const index = text.indexOf(EMOJI_CHAR);

      let entities = [];

      if (index !== -1) {
        entities.push({
          type: "custom_emoji",
          offset: index,
          length: 1,
          custom_emoji_id: EMOJI_ID
        });
      }

      return { text, entities };

    }

    let i = 0;

    const first = build(messages[0]);

    const msg = await ctx.reply(first.text, {
      entities: first.entities,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 Main Channel", url: mainLink }],
          [{ text: "🌍 Global Channel", url: globalLink }]
        ]
      }
    });

    let running = true;

    async function rotate() {

      while (running) {

        await sleep(3000);

        i = (i + 1) % messages.length;

        const data = build(messages[i]);

        try {
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            msg.message_id,
            undefined,
            data.text,
            {
              entities: data.entities,
              reply_markup: {
                inline_keyboard: [
                  [{ text: "📢 Main Channel", url: mainLink }],
                  [{ text: "🌍 Global Channel", url: globalLink }]
                ]
              }
            }
          );
        } catch {}

      }

    }

    rotate();

    setTimeout(() => {
      running = false;
    }, 120000);

  } catch (err) {
    console.log(err);
  }

});

/* ================= AUTO APPROVE ================= */
bot.on("chat_join_request", async (ctx) => {
  try {
    if (!GROUPS.includes(ctx.chat.id)) return;
    await ctx.approveChatJoinRequest(ctx.from.id);
  } catch {}
});

/* ================= CLEAN SYSTEM ================= */
bot.on("message", async (ctx) => {
  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    if (ctx.message.left_chat_member)
      return ctx.deleteMessage(ctx.message.message_id);

    if (ctx.message.new_chat_title)
      return ctx.deleteMessage(ctx.message.message_id);

    if (ctx.message.new_chat_photo)
      return ctx.deleteMessage(ctx.message.message_id);

  } catch {}
});

/* ================= START ================= */
bot.start((ctx) => {
  return ctx.reply(
`👋 Welcome ${ctx.from.first_name}`,
    Markup.inlineKeyboard([
      [{ text: "📢 Main Channel", url: mainLink }],
      [{ text: "🌍 Global Channel", url: globalLink }]
    ])
  );
});

/* ================= LAUNCH ================= */
bot.launch({
  dropPendingUpdates: true
});

console.log("🚀 Bot Running...");
