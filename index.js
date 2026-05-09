const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8585925975:AAEBTJeK8kg82XiJoJ4-Cs6xe-Wi2Bjbq1I");

/* ================= PREMIUM EMOJI ID ================= */
const EMOJI_ID = "5294000307074790591";
const EMOJI_CHAR = "⦿";

/* ================= GROUPS ================= */
const GROUPS = [
  -1002346718545,
  -1003527248014
];

/* ================= MESSAGES (20) ================= */
const messages = [

`🎊 Hey Welcome ${EMOJI_CHAR}\n👋 Smart Method Group-এ স্বাগতম!`,
`🔥 Welcome Buddy ${EMOJI_CHAR}\n📌 Stay active`,
`🚀 Hello ${EMOJI_CHAR}\n💬 Ask anything`,
`🎯 Welcome New Member ${EMOJI_CHAR}`,
`✨ You are now family ${EMOJI_CHAR}`,
`📣 Stay connected ${EMOJI_CHAR}`,
`💡 Learn & grow ${EMOJI_CHAR}`,
`🎁 Enjoy your stay ${EMOJI_CHAR}`,
`🌍 Global community ${EMOJI_CHAR}`,
`💬 Be active ${EMOJI_CHAR}`,
`🚀 Let’s grow together ${EMOJI_CHAR}`,
`🎊 Happy to have you ${EMOJI_CHAR}`,
`📢 Follow rules ${EMOJI_CHAR}`,
`💡 Stay safe ${EMOJI_CHAR}`,
`🎯 Smart Family ${EMOJI_CHAR}`,
`✨ Explore more ${EMOJI_CHAR}`,
`📊 Learn daily ${EMOJI_CHAR}`,
`🔥 Important member ${EMOJI_CHAR}`,
`🎊 Welcome again ${EMOJI_CHAR}`,
`🌟 Enjoy chat ${EMOJI_CHAR}`

];

/* ================= EMOJI BUILDER ================= */
function buildMessage(text, name) {

  const finalText = text.replace("Welcome", `Welcome ${name}`);

  const index = finalText.indexOf(EMOJI_CHAR);

  let entities = [];

  if (index !== -1) {
    entities.push({
      type: "custom_emoji",
      offset: index,
      length: 1,
      custom_emoji_id: EMOJI_ID
    });
  }

  return { text: finalText, entities };
}

/* ================= NEW MEMBER ================= */
bot.on("new_chat_members", async (ctx) => {

  try {

    if (!GROUPS.includes(ctx.chat.id)) return;

    try {
      await ctx.deleteMessage(ctx.message.message_id);
    } catch {}

    const user = ctx.message.new_chat_members[0];
    const name = user.first_name;

    let index = 0;

    const first = buildMessage(messages[0], name);

    const msg = await ctx.reply(first.text, {
      entities: first.entities,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 Main Channel", url: "https://t.me/yourlink" }],
          [{ text: "🌍 Global Channel", url: "https://t.me/yourlink" }]
        ]
      }
    });

    let running = true;

    async function rotate() {

      while (running) {

        await new Promise(r => setTimeout(r, 3000));

        index = (index + 1) % messages.length;

        const data = buildMessage(messages[index], name);

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
                  [{ text: "📢 Main Channel", url: "https://t.me/yourlink" }],
                  [{ text: "🌍 Global Channel", url: "https://t.me/yourlink" }]
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

/* ================= START ================= */
bot.start((ctx) => {
  return ctx.reply("Bot Running...");
});

bot.launch();

console.log("🚀 Bot Running...");
