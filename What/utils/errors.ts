// Copyright (c) 2022 Itz-fork
import { BotError } from "https://deno.land/x/grammy@v1.10.1/composer.ts";
import {
	GrammyError,
	HttpError,
} from "https://deno.land/x/grammy@v1.10.1/core/error.ts";

// deno-lint-ignore require-await
async function handle_errors(err: BotError) {
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
}

export { handle_errors };
