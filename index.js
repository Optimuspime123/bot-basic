const { Telegraf } = require('telegraf');
const fs = require('fs');

// Replace YOUR_BOT_TOKEN with your bot's token
const bot = new Telegraf('5898438900:AAE9nxChMKttcLCzxG6w7lls-NWE_ubpok8');

let filters = {};

// Load filters from file, if it exists
try {
  filters = JSON.parse(fs.readFileSync('filters.json'));
} catch (error) {
  console.log(error);
  
}

// Initialize empty object to store global filters for each user
let globalFilters = {};

// Load global filters from file, if it exists
try {
  globalFilters = JSON.parse(fs.readFileSync('global_filters.json'));
} catch (error) {
  console.log(error);
  }

bot.command('filter', (ctx) => {
  const userId = ctx.from.id;
  const message = ctx.message.text;
  const words = message.split(' ');
  if (words.length < 3) {
    ctx.reply('Invalid command. Please use the format "/filter phrase response"');
    return;
  }

  const phrase = words[1];
  const response = words.slice(2).join(' ');

  // Save the filter for the user
  if (!filters[userId]) {
    filters[userId] = {};
  }
  filters[userId][phrase] = response;

  ctx.reply(`Filter added: "${phrase}" => "${response}"`);
});

bot.command('gfilter', (ctx) => {
  const userId = ctx.from.id;
  const message = ctx.message.text;
  const words = message.split(' ');
  if (words.length < 2) {
    ctx.reply('Invalid command. Please use the format "/gfilter response"');
    return;
  }

  const response = words.slice(1).join(' ');

  // Save the global filter for the user
  globalFilters[userId] = response;

  ctx.reply(`Global filter added: "${response}"`);
});
bot.command('start', (ctx) => {
  ctx.reply(`Welcome to my bot! Here are a list of commands you can use:

- /help: Display this list of commands
- /filter "phrase to filter" response 
- /gfilter "phrase to filter " response 

Have fun and remember gfilter is only for groups `);
});

bot.command('help', (ctx) => {
  ctx.reply(`Welcome to my bot! Here are a list of commands you can use:

- /help: Display this list of commands
- /filter "phrase to filter" response 
- /gfilter "phrase to filter " response 

Have fun and remember gfilter is only for groups `);
});

bot.command('stop', (ctx) => {
  ctx.reply('Enter the text of the filter to delete:');
  // Use the state to store the current action
  ctx.session = ctx.session || {};
  ctx.session.action = 'stop';
});

bot.on('message', (ctx) => {
  const userId = ctx.from.id;
  const message = ctx.message.text;
if (!filters[userId] && !globalFilters[userId]) {
    return;
  }

  // Check if the message matches any of the user's filters
  for (const phrase in filters[userId]) {
    if (message.includes(phrase)) {
      ctx.reply(filters[userId][phrase]);
    }
  }

  // Check if the message matches any of the user's global filters
  if (globalFilters[userId]) {
    ctx.reply(globalFilters[userId]);
  }
});

  if (ctx.session && ctx.session.action === 'stop') {
    // Check if the user has a filter with the specified text
    let filterFound = false;
    for (const phrase in filters[userId]) {
      if (phrase === ctx.message.text) {
        filterFound = true;
        delete filters[userId][phrase];
        break;
      }
    }
    // Check if the user has a global filter with the specified text
    if (globalFilters[userId] === ctx.message.text) {
      filterFound = true;
      delete globalFilters[userId];
    }
    ctx.session.action = '';
    if (filterFound) {
      ctx.reply('Filter deleted.');
    } else {
      ctx.reply('Filter not found.');
   }}
  
  

bot.launch();

// Save filters to file when the bot shuts down
process.on('SIGINT', () => {
  fs.writeFileSync('filters.json', JSON.stringify(filters));
  fs.writeFileSync('global_filters.json', JSON.stringify(globalFilters));
  process.exit();
});
