const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8661744403:AAHDilDWlaQk34txhdbuAEaZ_xCICnf2UA4");

/* ================= WELCOME SYSTEM ================= */

bot.on("new_chat_members", async (ctx) => {
  try {
    const member = ctx.message.new_chat_members[0];

    const name = member.first_name;

    /* delete telegram default join message */
    try {
      await ctx.deleteMessage(ctx.message.message_id);
    } catch {}

    /* send welcome message */
    const msg = await ctx.reply(
`🎉 Welcome ${name}

✅ Welcome to our group

Please join our official channels below 👇`,
      Markup.inlineKeyboard([
        [
          Markup.button.url(
            "🌍 Main Telegram Channel",
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

    /* auto delete welcome message after 2 min */
    setTimeout(async () => {
      try {
        await ctx.deleteMessage(msg.message_id);
      } catch {}
    }, 120000);

  } catch (err) {
    console.log(err);
  }
});

/* ================= BAN ================= */

bot.command("ban", async (ctx) => {
  try {

    if (!ctx.message.reply_to_message) {
      return ctx.reply(
        "❌ Reply user message then use /ban"
      );
    }

    const userId =
      ctx.message.reply_to_message.from.id;

    const username =
      ctx.message.reply_to_message.from.username ||
      ctx.message.reply_to_message.from.first_name;

    await ctx.telegram.banChatMember(
      ctx.chat.id,
      userId
    );

    ctx.reply(`✅ ${username} banned successfully`);

  } catch (err) {
    console.log(err);
    ctx.reply("❌ Failed to ban user");
  }
});

/* ================= UNBAN ================= */

bot.command("unban", async (ctx) => {
  try {

    if (!ctx.message.reply_to_message) {
      return ctx.reply(
        "❌ Reply user message then use /unban"
      );
    }

    const userId =
      ctx.message.reply_to_message.from.id;

    const username =
      ctx.message.reply_to_message.from.username ||
      ctx.message.reply_to_message.from.first_name;

    await ctx.telegram.unbanChatMember(
      ctx.chat.id,
      userId
    );

    ctx.reply(`✅ ${username} unbanned successfully`);

  } catch (err) {
    console.log(err);
    ctx.reply("❌ Failed to unban user");
  }
});

/* ================= MUTE ================= */

bot.command("mute", async (ctx) => {
  try {

    if (!ctx.message.reply_to_message) {
      return ctx.reply(
        "❌ Reply user message then use /mute"
      );
    }

    const userId =
      ctx.message.reply_to_message.from.id;

    const username =
      ctx.message.reply_to_message.from.username ||
      ctx.message.reply_to_message.from.first_name;

    await ctx.telegram.restrictChatMember(
      ctx.chat.id,
      userId,
      {
        permissions: {
          can_send_messages: false
        }
      }
    );

    ctx.reply(`🔇 ${username} muted successfully`);

  } catch (err) {
    console.log(err);
    ctx.reply("❌ Failed to mute user");
  }
});

/* ================= UNMUTE ================= */

bot.command("unmute", async (ctx) => {
  try {

    if (!ctx.message.reply_to_message) {
      return ctx.reply(
        "❌ Reply user message then use /unmute"
      );
    }

    const userId =
      ctx.message.reply_to_message.from.id;

    const username =
      ctx.message.reply_to_message.from.username ||
      ctx.message.reply_to_message.from.first_name;

    await ctx.telegram.restrictChatMember(
      ctx.chat.id,
      userId,
      {
        permissions: {
          can_send_messages: true,
          can_send_media_messages: true,
          can_send_other_messages: true,
          can_add_web_page_previews: true
        }
      }
    );

    ctx.reply(`🔊 ${username} unmuted successfully`);

  } catch (err) {
    console.log(err);
    ctx.reply("❌ Failed to unmute user");
  }
});

/* ================= START BOT ================= */

bot.launch();

console.log("🚀 Group Manager Bot Running...");
