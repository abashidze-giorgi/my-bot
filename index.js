require('dotenv').config();

const {Bot, Keyboard, InlineKeyboard, GrammyError, HttpError } = require('grammy');
const { Menu } = require("@grammyjs/menu");

const bot = new Bot(process.env.BOT_API_KEY);

const menu = new Menu("my-menu")
  .text("A", (ctx) => ctx.reply(pressedA(ctx)))
  .text("B", (ctx) => ctx.reply(`You pressed ${ctx.callbackQuery.data}! ${ctx.from.username}`));

bot.use(menu);

function pressedA(ctx){
  console.log(ctx.callbackQuery.data.split('/')[0]);
  return `You pressed ${ctx.callbackQuery.data.split('/')[1]}! ${ctx.from.username}`
};

bot.command('start', async (ctx) => {
    const keyboard = new Keyboard()
    .text("HTML")
    .text("CSS")
    .row()
    .text("JavaScript")
    .text("React")
    .resized();

    await ctx.reply("Check out this menu:", { reply_markup: menu });
  
    let user = ctx.from.first_name +' ' +  ctx.from.last_name;
    await ctx.reply(`Привет ${user}!`,);

    await ctx.reply('Выбери тему, о чем будем говорить', {
        reply_markup: keyboard,
    });
})

bot.command("Logeek", async (ctx) => {
    await ctx.reply("Help text")
  });

//Bot hear, what theme user want to talk.
bot.hears(["HTML", "CSS", "JavaScript", "React"], async (ctx) => {
    const inlineKeyboard = new InlineKeyboard()
    .text('Получить ответ', 'getAnswer')
    .text('отмена', 'cancel');
    await ctx.reply('ppppp', {
      reply_markup: inlineKeyboard,
  });
})

bot.on('callback_query:data', async(ctx) => {
  if(ctx.callbackQuery.data === 'cancel'){
    await ctx.reply('cancel');
    await ctx.answerCallbackQuery();
  }else if(ctx.callbackQuery.data === 'getAnswer'){
    console.log('Lოgeek is pushed');
  }
});

//Error handler
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
  });

bot.start();
