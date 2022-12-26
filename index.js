const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome to my Telegram bot! Why are you so stupid?'));

bot.hears('good morning', (ctx) => ctx.reply('Good morning to you too!'));

bot.hears('Thomas', (ctx) => ctx.reply('Mopitibat has read your message, you fool! Stop annoying him'));

bot.hears('Fela', (ctx) => ctx.reply('Fela is a great guy , love him! '));
bot.hears('SoSo', (ctx) => ctx.reply('Careful , that's my son you're talking about  '));
bot.hears('Optimus', (ctx) => ctx.reply('Aye aye captain! '));
bot.launch();
