const { Telegraf } = require("telegraf");

const bot = new Telegraf("8661744403:AAHDilDWlaQk34txhdbuAEaZ_xCICnf2UA4");

/* ================= BAN ================= */
bot.command("ban", async (ctx) => {
  try {
    const text = ctx.message.text.split(" ");
    let userId;

    if (ctx.message.reply_to_message) {
      userId = ctx.message.reply_to_message.from.id;
    } else if (text[1]) {
      const username = text[1].replace("@", "");
      const members = await ctx.telegram.getChatAdministrators(ctx.chat.id);

      const user = members.find(u => u.user.username === username);
      if (!user) return ctx.reply("❌ User not found");

      userId = user.user.id;
    } else {
      return ctx.reply("❌ Use /ban @username or reply user");
    }

    await ctx.telegram.banChatMember(ctx.chat.id, userId);
    ctx.reply("✅ User banned successfully");

  } catch (err) {
    console.log(err);
    ctx.reply("❌ Failed to ban user");
  }
});

/* ================= UNBAN ================= */
bot.command("unban", async (ctx) => {
  try {
    const text = ctx.message.text.split(" ");

    let userId;

    if (ctx.message.reply_to_message) {
      userId = ctx.message.reply_to_message.from.id;
    } else if (text[1]) {
      const username = text[1].replace("@", "");
      const members = await ctx.telegram.getChatAdministrators(ctx.chat.id);

      const user = members.find(u => u.user.username === username);
      if (!user) return ctx.reply("❌ User not found");

      userId = user.user.id;
    } else {
      return ctx.reply("❌ Use /unban @username or reply user");
    }

    await ctx.telegram.unbanChatMember(ctx.chat.id, userId);
    ctx.reply("✅ User unbanned successfully");

  } catch (err) {
    console.log(err);
    ctx.reply("❌ Failed to unban user");
  }
});

/* ================= MUTE ================= */
bot.command("mute", async (ctx) => {
  try {
    const text = ctx.message.text.split(" ");
    let userId;

    if (ctx.message.reply_to_message) {
      userId = ctx.message.reply_to_message.from.id;
    } else if (text[1]) {
      const username = text[1].replace("@", "");
      const members = await ctx.telegram.getChatAdministrators(ctx.chat.id);

      const user = members.find(u => u.user.username === username);
      if (!user) return ctx.reply("❌ User not found");

      userId = user.user.id;
    } else {
      return ctx.reply("❌ Use /mute @username or reply user");
    }

    await ctx.telegram.restrictChatMember(ctx.chat.id, userId, {
      permissions: {
        can_send_messages: false
      }
    });

    ctx.reply("🔇 User muted successfully");

  } catch (err) {
    console.log(err);
    ctx.reply("❌ Failed to mute user");
  }
});

/* ================= UNMUTE ================= */
bot.command("unmute", async (ctx) => {
  try {
    const text = ctx.message.text.split(" ");
    let userId;

    if (ctx.message.reply_to_message) {
      userId = ctx.message.reply_to_message.from.id;
    } else if (text[1]) {
      const username = text[1].replace("@", "");
      const members = await ctx.telegram.getChatAdministrators(ctx.chat.id);

      const user = members.find(u => u.user.username === username);
      if (!user) return ctx.reply("❌ User not found");

      userId = user.user.id;
    } else {
      return ctx.reply("❌ Use /unmute @username or reply user");
    }

    await ctx.telegram.restrictChatMember(ctx.chat.id, userId, {
      permissions: {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true
      }
    });

    ctx.reply("🔊 User unmuted successfully");

  } catch (err) {
    console.log(err);
    ctx.reply("❌ Failed to unmute user");
  }
});

/* ================= START ================= */
bot.launch();

console.log("🚀 Group Manager Bot Running...");
