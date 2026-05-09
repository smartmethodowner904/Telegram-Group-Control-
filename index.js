const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8585925975:AAEBTJeK8kg82XiJoJ4-Cs6xe-Wi2Bjbq1I");

/* ================= CUSTOM PREMIUM EMOJI IDs ================= */
// এখানে তোমার আইডি বসাবে (নিচে লগার থেকে কপি করে বসাও)
const PREMIUM_EMOJIS = {
  "🎊": "5368333739050150004",   // এখানে তোমার আইডি বসাও
  "👋": "5368333739050150005",
  "🔥": "5368333739050150006",
  "🚀": "5368333739050150007",
  "✨": "5368333739050150008",
  "👑": "5368333739050150009",
  "🌍": "5368333739050150010",
  "🎯": "5368333739050150011",
  "💡": "5368333739050150012",
  "🎁": "5368333739050150013",
  "🌟": "5368333739050150014",
  "💬": "5368333739050150015",
  "📢": "5368333739050150016",
  "⚡": "5368333739050150017",
  "📌": "5368333739050150018",
  // আরও চাইলে এখানে যোগ করো
};

/* ================= GROUPS & CHANNELS ================= */
const GROUPS = [-1002346718545, -1003994441271];

const MAIN_CHANNEL_ID = -1002315458574;
const GLOBAL_CHANNEL_ID = -1002510081290;

let mainLink = "https://t.me/+75BQ2Qw9UZI4OTM1";
let globalLink = "https://t.me/Global_Method_Channel";

/* ================= HELPERS ================= */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// প্রিমিয়াম ইমোজি সহ টেক্সট তৈরি করার ফাংশন
function createPremiumText(text) {
  const entities = [];
  let offset = 0;

  for (const [emoji, customId] of Object.entries(PREMIUM_EMOJIS)) {
    const regex = new RegExp(emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    let match;
    while ((match = regex.exec(text)) !== null) {
      entities.push({
        type: "custom_emoji",
        offset: match.index,
        length: match[0].length,
        custom_emoji_id: customId
      });
    }
  }
  return { text, entities };
}

/* ================= EMOJI ID LOGGER (আইডি বের করার জন্য) ================= */
bot.on("message", async (ctx) => {
  if (ctx.message.entities && ctx.message.entities.some(e => e.type === "custom_emoji")) {
    console.log("\n🔥 CUSTOM EMOJI ID পাওয়া গেছে:");
    console.log(JSON.stringify(ctx.message.entities, null, 2));
  }
});

/* ================= CREATE LINKS ================= */
async function createLinks(ctx) {
  try {
    const mainInvite = await ctx.telegram.createChatInviteLink(MAIN_CHANNEL_ID, {
      expire_date: Math.floor(Date.now() / 1000) + 3600,
      member_limit: 1
    });
    mainLink = mainInvite.invite_link;
  } catch (e) {}

  try {
    const globalInvite = await ctx.telegram.createChatInviteLink(GLOBAL_CHANNEL_ID, {
      expire_date: Math.floor(Date.now() / 1000) + 3600,
      member_limit: 1
    });
    globalLink = globalInvite.invite_link;
  } catch (e) {}
}

/* ================= AUTO APPROVE ================= */
bot.on("chat_join_request", async (ctx) => {
  if (!GROUPS.includes(ctx.chat.id)) return;
  await ctx.approveChatJoinRequest(ctx.from.id).catch(() => {});
});

/* ================= MESSAGE SYSTEM (Welcome) ================= */
bot.on("message", async (ctx) => {
  try {
    if (!GROUPS.includes(ctx.chat.id)) return;

    const members = ctx.message.new_chat_members || ctx.update.message?.new_chat_members;
    if (!members) return;

    await ctx.deleteMessage().catch(() => {});
    await createLinks(ctx);

    const user = members[0];
    const name = user.first_name || "Member";

    const baseMessages = [
      `🎊 Hey ${name}\n👋 Welcome to Smart Method Chat`,
      `🔥 Hey ${name}\n📌 Stay active & enjoy`,
      `🚀 Hey ${name}\n💬 Feel free to ask anything`,
      `🎯 Hey ${name}\n📢 Join our channels below`,
      `✨ Hey ${name}\n👑 You are now part of Smart Family`,
      `📣 Hey ${name}\n⚡ Don’t miss updates`,
      `💡 Hey ${name}\n📊 Learn & grow here`,
      `🎁 Hey ${name}\n🎉 Enjoy your stay`,
      `🌍 Hey ${name}\n🔥 Global community`,
      `💬 Hey ${name}\n📌 Be active always`,
      `🚀 Hey ${name}\n⚡ Let’s grow together`,
      `🎊 Hey ${name}\n👋 Happy to have you`,
      `📢 Hey ${name}\n🔥 Follow rules`,
      `💡 Hey ${name}\n📣 Stay connected`,
      `🎯 Hey ${name}\n👑 Smart Method Family`,
      `✨ Hey ${name}\n🚀 Explore opportunities`,
      `📊 Hey ${name}\n💬 Chat & learn`,
      `🔥 Hey ${name}\n📌 Important member`,
      `🎊 Hey ${name}\n👋 Welcome again`,
      `🌟 Hey ${name}\n💬 Enjoy Smart Method Chat`
    ];

    const firstMsg = createPremiumText(baseMessages[0]);

    const msg = await ctx.reply(firstMsg.text, {
      entities: firstMsg.entities,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 Main Channel", url: mainLink }],
          [{ text: "🌍 Global Method Channel", url: globalLink }],
          [{ text: "♻️ Generate", callback_data: "generate_links" }]
        ]
      }
    });

    let index = 0;
    let running = true;

    async function rotate() {
      while (running) {
        await sleep(3000);
        index = (index + 1) % baseMessages.length;
        const current = createPremiumText(baseMessages[index]);

        try {
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            msg.message_id,
            undefined,
            current.text,
            {
              entities: current.entities,
              reply_markup: {
                inline_keyboard: [
                  [{ text: "📢 Main Channel", url: mainLink }],
                  [{ text: "🌍 Global Method Channel", url: globalLink }],
                  [{ text: "♻️ Generate", callback_data: "generate_links" }]
                ]
              }
            }
          );
        } catch (e) {}
      }
    }

    rotate();

    setTimeout(async () => {
      running = false;
      await ctx.deleteMessage(msg.message_id).catch(() => {});
    }, 120000);

  } catch (err) {
    console.log(err);
  }
});

/* ================= CALLBACKS ================= */
bot.action("generate_links", async (ctx) => {
  try {
    await ctx.answerCbQuery("Generating...");
    await createLinks(ctx);

    await ctx.editMessageReplyMarkup({
      inline_keyboard: [
        [{ text: "📢 Main Channel", url: mainLink }],
        [{ text: "🌍 Global Method Channel", url: globalLink }],
        [{ text: "✅ Create Done", callback_data: "generate_links" }]
      ]
    });
  } catch (err) {}
});

bot.start(async (ctx) => {
  const welcomeText = createPremiumText(`👋 Welcome ${ctx.from.first_name}`);
  return ctx.reply(welcomeText.text, {
    entities: welcomeText.entities,
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 Main Channel", url: mainLink }],
        [{ text: "🌍 Global Method Channel", url: globalLink }],
        [{ text: "♻️ Generate", callback_data: "generate_links" }],
        [{ text: "✅ Joined", callback_data: "joined_ok" }]
      ]
    }
  });
});

bot.action("joined_ok", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply("✅ Bot Unlock Successful");
});

/* ================= LAUNCH ================= */
bot.launch({ dropPendingUpdates: true });
console.log("🚀 Bot Running...");
