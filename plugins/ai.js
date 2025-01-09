const { izumi, mode } = require("../lib");
const fetch = require("node-fetch");
izumi({
  pattern: 'gpt3 ?(.*)',
  fromMe: mode,
  desc: 'Responds with AI-generated content from the GPT-3.',
  type: 'ai' 
}, async (message, match) => {
  if (!match) {
    return await message.reply('Please provide some input text.');
  }

  try {
    const api = `https://api.siputzx.my.id/api/ai/gpt3?prompt=You%20are%20a%20cheerful%20person.&content=${encodeURIComponent(match)}`;
    const res = await fetch(api);
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    const msg = data.data || 'No response from the API.';
    await message.reply(msg);
  } catch (err) {
    await message.reply(`Error: ${err.message}`);
  }
});

izumi({
  pattern: 'meta ?(.*)',
  fromMe: mode,
  desc: 'Responds with AI-generated content from the Meta-Llama-33-70B',
  type: 'ai' 
}, async (message, match) => {
  if (!match) {
    return await message.reply('Please provide some input text.');
  }

  try {
    const api = `https://api.siputzx.my.id/api/ai/meta-llama-33-70B-instruct-turbo?content=${encodeURIComponent(match)}`;
    const res = await fetch(api);
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    const msg = data.data || 'No response from the API.';
    await message.reply(msg);
  } catch (err) {
    await message.reply(`Error: ${err.message}`);
  }
});

izumi({
  pattern: 'llama ?(.*)', 
  fromMe: true,
  desc: 'Responds with AI-generated content from the Llama33',
  type: 'ai'
}, async (message, match) => {
  if (!match) {
    return await message.reply('Please provide some input text.');
  }

  try {
    const api = `https://api.siputzx.my.id/api/ai/llama33?prompt=mad%20and%20crazy%20&text=${encodeURIComponent(match)}`;
    const res = await fetch(api);
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    const msg = data.data || 'No response from the API.';
    await message.reply(msg);
  } catch (err) {
    await message.reply(`Error: ${err.message}`);
  }
});

izumi({
  pattern: 'gemini ?(.*)',
  fromMe: true,
  desc: 'Gemini',
  type: 'ai'
}, async (message, match) => {
  if (!match) {
    return await message.reply('Please provide some input text.');
  }
  try {
    const api = `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(match)}`;
    const res = await fetch(api);
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }
    const data = await res.json();
    const msg = data.data || 'No response from the API.';
    await message.reply(msg);
  } catch (err) {
    await message.reply(`Error: ${err.message}`);
  }
});
