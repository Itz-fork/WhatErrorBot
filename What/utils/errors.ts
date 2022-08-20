// Copyright (c) 2022 Itz-fork
import { BotError } from "https://deno.land/x/grammy@v1.10.1/composer.ts";
import {
	GrammyError,
	HttpError,
} from "https://deno.land/x/grammy@v1.10.1/core/error.ts";

// deno-lint-ignore require-await
async function handle_errors(err: BotError) {
	const uid = err.ctx.update.update_id;
	const e = err.error;
	if (e instanceof GrammyError) {
		console.error(
			`ERROR!!! \nUpdate ID: ${uid}\nDescription: ${e.description}`,
		);
	} else if (e instanceof HttpError) {
		console.error(
			`ERROR!!! \nUpdate ID: ${uid}\nDescription: Could not contact Telegram due to ${e}`,
		);
	} else {
		console.error(`ERROR!!! \nUpdate ID: ${uid}\nDescription: ${e}`);
	}
}

export { handle_errors };
