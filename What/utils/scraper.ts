// Copyright (c) 2022 Itz-fork
// I thought I don't do drugs then I saw this code I wrote few weeks ago

async function scrape_tg_errors(url: string) {
	const resp = await (await fetch(url)).json();
	// deno-lint-ignore prefer-const ban-types
	let erros_list: Array<object> = [];

	// Iter through the values of erros key and collect them in erros object
	for (let [cd, errs] of Object.entries(resp.errors)) {
		console.log(` - Indexing ${cd} level errors...`);
		// @ts-ignore fuck this warning, it works
		for (let [key, val] of Object.entries(errs)) {
			erros_list.push({
				error: key,
				description: resp.descriptions[key],
				methods: val,
			});
		}
	}

	return erros_list;
}

export default scrape_tg_errors;
