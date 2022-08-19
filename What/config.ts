const whatconf = {
  bot_token: Deno.env.get("BOT_TOKEN") || "",
  mongodb_url: Deno.env.get("MONGODB_URL") || "",
  error_file: Deno.env.get("ERROR_FILE") || "",
};
export default whatconf;
