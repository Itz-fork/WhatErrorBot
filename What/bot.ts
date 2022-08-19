// Copyright (c) 2022 Itz-fork

import { Bot, InlineKeyboard } from 'https://deno.land/x/grammy@v1.10.1/mod.ts';

import whatconf from './config.ts';
import { handle_errors } from './utils/errors.ts';
import { index_data, search_database } from './database.ts';

// Bot instance
const WhatErrBot = new Bot(whatconf.bot_token);
WhatErrBot.catch(handle_errors);

// Start command
WhatErrBot.on('message:text', async (ctx) => {
	await ctx.reply(
		`
Hi, I'm <b>What Error Bot</b>!

I can help you to search for telegram api errors and get information about them!
  `,
		{
			reply_markup: new InlineKeyboard()
				.switchInlineCurrent('Quick Search ⚡')
				.switchInline('Search for errors 🔎'),
			parse_mode: 'HTML',
		},
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
				cache_time: 5,
				switch_pm_text: 'Need more than 3 characters to search',
				switch_pm_parameter: 'start',
			},
		);
		return;
	}

	// deno-lint-ignore prefer-const
	let inline_results = [];
	// deno-lint-ignore prefer-const
	for (let [key, val] of Object.entries(await search_database(query))) {
		// Creating api methods list
		let api_methods = '';
		val.methods.forEach((method) =>
			api_methods +=
				`  • <a href="https://core.telegram.org/method/${method}">${method}</a>\n`
		);
		inline_results.push({
			type: 'article',
			id: `whaterrorbot-result-${key}`,
			title: val.error,
			input_message_content: {
				message_text: `
<b>➭ API Error:</b> <code>${val.error}</code>

<b>➭ API Method(s):</b>
${api_methods}
<b>➭ Description:</b> <code>${val.description}</code>`,
				parse_mode: 'HTML',
				disable_web_page_preview: true,
			},
			url: 'https://core.telegram.org/api/errors',
			description: val.description,
		});
	}

	// Check if inline_results array is not empty
	if (inline_results.length == 0) {
		await ctx.answerInlineQuery(
			[],
			{
				cache_time: 5,
				switch_pm_text: `Found nothing for ${query}`,
				switch_pm_parameter: 'start',
			},
		);
		return;
	}
	await ctx.answerInlineQuery(
		// @ts-ignore fuck this
		inline_results,
		{
			cache_time: 10,
			switch_pm_text: `Found ${inline_results.length} results!`,
			switch_pm_parameter: 'start',
		},
	);
});

// Start functions
console.log('[+] Indexing telegram erros list');
await index_data();
console.log('[+] Starting the bot');
await WhatErrBot.start();
