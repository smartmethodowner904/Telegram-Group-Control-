const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8585925975:AAEBTJeK8kg82XiJoJ4-Cs6xe-Wi2Bjbq1I");

/* ================= CONFIGURATION ================= */

const GROUPS = [-1002346718545, -1003994441271];
const MAIN_CHANNEL_ID = -1002315458574;
const GLOBAL_CHANNEL_ID = -1002510081290;

let mainLink = "https://t.me/+75BQ2Qw9UZI4OTM1";
let globalLink = "https://t.me/Global_Method_Channel";

// আপনার দেওয়া Premium Emoji ID
const PREMIUM_EMOJI_ID = "5294000307074790591";

/* ================= UTILS ================= */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createLinks(ctx) {
  try {
    const mainInvite = await ctx.telegram.createChatInviteLink(MAIN_CHANNEL_ID, {
      expire_date: Math.floor(Date.now() / 1000) + 3600,
      member_limit: 1
    });
    mainLink = mainInvite.invite_link;
  } catch (err) { console.log("Main link error"); }

  try {
    const globalInvite = await ctx.telegram.createChatInviteLink(GLOBAL_CHANNEL_ID, {
      expire_date: Math.floor(Date.now() / 1000) + 3600,
      member_limit: 1
    });
    globalLink = globalInvite.invite_link;
  } catch (err) { console.log("Global link error"); }
}

/* ================= AUTO APPROVE ================= */

bot.on("chat_join_request", async (ctx) => {
  try {
    if (!GROUPS.includes(ctx.chat.id)) return;
    await ctx.approveChatJoinRequest(ctx.from.id);
  } catch (err) { console.log(err); }
});

/* ================= WELCOME SYSTEM ================= */

bot.on("new_chat_members", async (ctx) => {
  try {
    if (!GROUPS.includes(ctx.chat.id)) return;

    const user = ctx.message.new_chat_members[0];
    const name = user.first_name;
    await createLinks(ctx);

    const messages = [
      `⭐ Hey ${name}\n👋 Welcome to Smart Method Chat`,
      `⭐ Hey ${name}\n📌 Stay active & enjoy`,
      `⭐ Hey ${name}\n💬 Feel free to ask anything`,
      `⭐ Hey ${name}\n📢 Join our channels below`,
      `⭐ Hey ${name}\n👑 You are now part of Smart Family`,
      `⭐ Hey ${name}\n⚡ Don’t miss updates`,
      `⭐ Hey ${name}\n📊 Learn & grow here`,
      `⭐ Hey ${name}\n🎉 Enjoy your stay`,
      `⭐ Hey ${name}\n🔥 Global community`,
      `⭐ Hey ${name}\n📌 Be active always`,
      `⭐ Hey ${name}\n⚡ Let’s grow together`,
      `⭐ Hey ${name}\n👋 Happy to have you`,
      `⭐ Hey ${name}\n🔥 Follow rules`,
      `⭐ Hey ${name}\n📣 Stay connected`,
      `⭐ Hey ${name}\n👑 Smart Method Family`,
      `⭐ Hey ${name}\n🚀 Explore opportunities`,
      `⭐ Hey ${name}\n💬 Chat & learn`,
      `⭐ Hey ${name}\n📌 Important member`,
      `⭐ Hey ${name}\n👋 Welcome again`,
      `⭐ Hey ${name}\n💬 Enjoy Smart Method Chat`
    ];

    let index = 0;

    // মেসেজের শুরুতে থাকা "⭐" কে Premium Emoji তে রূপান্তর করার ফাংশন
    const getExtraParams = (text) => ({
      entities: [
        {
          offset: 0,
          length: 2, // "⭐ " এর দৈর্ঘ্য
          type: "custom_emoji",
          custom_emoji_id: PREMIUM_EMOJI_ID
        }
      ],
      ...Markup.inlineKeyboard([
        [Markup.button.url("📢 Main Channel", mainLink)],
        [Markup.button.url("🌍 Global Method Channel", globalLink)],
        [Markup.button.callback("♻️ Generate", "generate_links")]
      ])
    });

    const msg = await ctx.reply(messages[0], getExtraParams(messages[0]));

    // Delete Join Message
    setTimeout(async () => {
      try { await ctx.deleteMessage(ctx.message.message_id); } catch {}
    }, 5000);

    let running = true;

    // Rotating Text with Premium Emoji Support
    async function rotate() {
      while (running) {
        await sleep(3000);
        try {
          index = (index + 1) % messages.length;
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            msg.message_id,
            undefined,
            messages[index],
            getExtraParams(messages[index])
          );
        } catch { running = false; }
      }
    }
    rotate();

    // Auto Delete Welcome Message
    setTimeout(async () => {
      running = false;
      try { await ctx.deleteMessage(msg.message_id); } catch {}
    }, 120000);

  } catch (err) { console.log(err); }
});

/* ================= ACTIONS & CLEANUP ================= */

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
  } catch (err) { console.log(err); }
});

bot.on("message", async (ctx) => {
  try {
    if (!GROUPS.includes(ctx.chat.id)) return;
    if (ctx.message.left_chat_member || ctx.message.new_chat_title || ctx.message.new_chat_photo) {
      return ctx.deleteMessage(ctx.message.message_id);
    }
  } catch {}
});

bot.start(async (ctx) => {
  return ctx.reply(`👋 Welcome ${ctx.from.first_name}`, Markup.inlineKeyboard([
    [Markup.button.url("📢 Main Channel", mainLink)],
    [Markup.button.url("🌍 Global Method Channel", globalLink)],
    [Markup.button.callback("♻️ Generate", "generate_links")],
    [Markup.button.callback("✅ Joined", "joined_ok")]
  ]));
});

bot.action("joined_ok", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.reply("✅ Bot Unlock Successful");
});

bot.launch({ dropPendingUpdates: true });
console.log("🚀 Bot Running with Premium Emoji Support...");
