// Copyright (c) 2022 Itz-fork

const whatconf = {
	bot_token: Deno.env.get("BOT_TOKEN") ?? "",
	mongodb_url: Deno.env.get("MONGODB_URL") ?? "",
	error_file:
		"https://core.telegram.org/file/464001971/11361/nCsgOjxdfxA.77184.json/a27921641b664931c6" ??
			Deno.env.get("ERROR_FILE"),
};
export default whatconf;
