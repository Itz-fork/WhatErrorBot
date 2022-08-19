import { Bot } from "https://deno.land/x/grammy@v1.10.1/mod.ts";
import whatconf from "./config.ts";
import { index_data, search_database } from "./database.ts";

// Bot instance
const WhatErrBot = new Bot(whatconf.bot_token);

// Start command
WhatErrBot.command("start", async (ctx) => {
  await ctx.reply(
    `
Hi, I'm <b>What Error Bot</b>!

I can help you to search for telegram api errors and get information about them!
  `,
    { parse_mode: "HTML" },
  );
});

// Inline search
WhatErrBot.inlineQuery(/[a-z|A-Z]+/, async (ctx) => {
  const query = ctx.inlineQuery.query;
  // Validate query length before searching
  if (query.length <= 3) {
    await ctx.answerInlineQuery(
      [],
      {
        cache_time: 10,
        switch_pm_text: "Need more than 3 characters to search",
        switch_pm_parameter: "start",
      },
    );
    return;
  }
  let inline_results = [];
  const eresults = await search_database(query);
  for (let [key, val] of Object.entries(eresults)) {
    inline_results.push({
      type: "article",
      id: `whaterrorbot-result-${key}`,
      title: val.error,
      input_message_content: {
        message_text: `
<b>➭ API Error:</b> <code>${val.error}</code>

<b>➭ API Method(s):</b> <code>${val.methods}</code>

<b>➭ Description:</b> <code>${val.description}</code>`,
        parse_mode: "HTML",
      },
      url: "https://core.telegram.org/api/errors",
      description: val.description,
    });
  }

  // Check if inline_results array is not empty
  if (inline_results.length == 0) {
    await ctx.answerInlineQuery(
      [],
      {
        cache_time: 10,
        switch_pm_text: `Found nothing for ${query}`,
        switch_pm_parameter: "start",
      },
    );
    return;
  }
  await ctx.answerInlineQuery(
    // @ts-ignore fuck this
    inline_results,
    {
      cache_time: 600,
      switch_pm_text: `Found ${inline_results.length} results!`,
      switch_pm_parameter: "start",
    },
  );
});


// Start functions
console.log("[+] Indexing telegram erros list");
await index_data();
console.log("[+] Starting the bot");
await WhatErrBot.start();