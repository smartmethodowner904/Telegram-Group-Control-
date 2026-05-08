const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("YOUR_BOT_TOKEN");

/* GROUPS */
const GROUPS = [
  -1003723410396,
  -1002346718545
];

/* CHANNELS */
const MAIN_CHANNEL_ID = -1003871207695;
const GLOBAL_CHANNEL_ID = -1003766522560;

/* LINKS */
let mainLink = "https://t.me/yourmain";
let globalLink = "https://t.me/yourglobal";

/* SLEEP */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* CREATE LINKS */
async function createLinks(ctx) {
  try {
    const main = await ctx.telegram.createChatInviteLink(
      MAIN_CHANNEL_ID,
      { expire_date: Math.floor(Date.now() / 1000) + 3600, member_limit: 1 }
    );

    const global = await ctx.telegram.createChatInviteLink(
      GLOBAL_CHANNEL_ID,
      { expire_date: Math.floor(Date.now() / 1000) + 3600, member_limit: 1 }
    );

    mainLink = main.invite_link;
    globalLink = global.invite_link;

  } catch (e) {
    console.log(e);
  }
}

/* JOIN EVENT (IMPORTANT FIX) */
bot.on("new_chat_members", async (ctx) => {

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

  let i = 0;

  const msg = await ctx.reply(
    messages[0],
    Markup.inlineKeyboard([
      [Markup.button.url("📢 Main Channel", mainLink)],
      [Markup.button.url("🌍 Global Channel", globalLink)]
    ])
  );

  const interval = setInterval(async () => {
    try {
      i = (i + 1) % messages.length;

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        msg.message_id,
        undefined,
        messages[i],
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "📢 Main Channel", url: mainLink }],
              [{ text: "🌍 Global Channel", url: globalLink }]
            ]
          }
        }
      );

    } catch {}
  }, 4000); // safe delay (NOT 3 sec crash fix)

  setTimeout(async () => {
    clearInterval(interval);
    try {
      await ctx.deleteMessage(msg.message_id);
    } catch {}
  }, 120000);

});

/* CLEAN EVENTS */
bot.on("message", async (ctx) => {
  if (!GROUPS.includes(ctx.chat.id)) return;

  if (ctx.message.left_chat_member ||
      ctx.message.new_chat_title ||
      ctx.message.new_chat_photo) {
    try {
      await ctx.deleteMessage(ctx.message.message_id);
    } catch {}
  }
});

/* START */
bot.start(async (ctx) => {
  return ctx.reply(
    `👋 Welcome ${ctx.from.first_name}`,
    Markup.inlineKeyboard([
      [Markup.button.url("📢 Main Channel", mainLink)],
      [Markup.button.url("🌍 Global Channel", globalLink)]
    ])
  );
});

/* LAUNCH */
bot.launch({ dropPendingUpdates: true });

console.log("🚀 Bot Running...");
