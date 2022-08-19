import { MongoClient } from "https://deno.land/x/mongo@v0.31.0/mod.ts";
import whatconf from "./config.ts";
import { DBSchema } from "./helpers/interfaces.ts";
import scrape_tg_errors from "./helpers/scraper.ts";

// Mongodb client
const client = new MongoClient();
await client.connect(whatconf.mongodb_url);
const db = client.database("WhatsErrorBot");
const erros_col = db.collection<DBSchema>("WhatErrorBot_DB");

// Index data
async function index_data() {
  console.log("[+] Indexing telegram erros list");
  const edata = await scrape_tg_errors(whatconf.error_file);
  await erros_col.deleteMany({});
  // @ts-ignore No shit
  await erros_col.insertMany(edata);
}

// Search the database collection for the error
async function search_database(query: string) {
  let results: { [key: number]: DBSchema } = {};
  const docs = await erros_col.aggregate([
    {
      "$search": {
        "index": "default",
        "text": {
          "query": `${query}`,
          "path": {
            "wildcard": "*",
          },
        },
      },
    },
    { $limit: 10 },
  ]);
  await docs.forEach((item: DBSchema, index: number) => results[index] = item);
  return results;
}

export { index_data, search_database };
