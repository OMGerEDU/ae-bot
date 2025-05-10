import { Telegraf } from 'telegraf';
import axios from 'axios';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const HOST = process.env.NEXT_PUBLIC_HOST_NAME as string;

if (!BOT_TOKEN) {
  throw new Error('Missing TELEGRAM_BOT_TOKEN env var');
}
if (!HOST) {
  throw new Error('Missing NEXT_PUBLIC_HOST_NAME env var');
}

const bot = new Telegraf(BOT_TOKEN);

bot.command('link', async (ctx) => {
  const parts = ctx.message.text.split(' ').slice(1);
  if (parts.length === 0) {
    return ctx.reply('Usage: /link <AliExpress URL>');
  }
  const url = parts.join(' ');

  try {
    const { data } = await axios.post(`${HOST}/api/link`, { url });
    if (data.link) {
      return ctx.reply(data.link);
    }
    return ctx.reply('Could not generate link');
  } catch (err) {
    console.error(err);
    return ctx.reply('API error');
  }
});

export function launchBot() {
  bot.launch().then(() => {
    console.log('Telegram bot running');
  });
}
