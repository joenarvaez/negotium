// Plaid over its REST API: Hosted Link to connect banks, then transactions and balances into workspace/finance.
// `check` only confirms the keys work. Access tokens stay in finance/.items.json on this server.
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const DIR = "/home/node/.openclaw/workspace/finance";
const ITEMS = `${DIR}/.items.json`;
const PENDING = `${DIR}/.pending-link`;
const USER = `${DIR}/.user.json`;
const OWNER = "negotium-owner";
const { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV } = process.env;
const [cmd] = process.argv.slice(2);

async function plaid(path, body = {}) {
  const res = await fetch(`https://${PLAID_ENV}.plaid.com${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: PLAID_CLIENT_ID, secret: PLAID_SECRET, ...body }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`plaid ${path}: ${json.error_code} ${json.error_message}`);
  return json;
}

const linkRequest = extra => ({
  client_name: "negotium", language: "en", country_codes: ["US"],
  user: { client_user_id: OWNER }, products: ["transactions"], ...extra,
});
// Reason: linking several banks in one session (Multi-Item Link) needs a Plaid user, made once.
async function plaidUser() {
  if (existsSync(USER)) return JSON.parse(readFileSync(USER, "utf8")).user_id;
  const { user_id } = await plaid("/user/create", { client_user_id: OWNER });
  writeFileSync(USER, JSON.stringify({ user_id }), { mode: 0o600 });
  return user_id;
}
const items = () => (existsSync(ITEMS) ? JSON.parse(readFileSync(ITEMS, "utf8")) : []);
mkdirSync(DIR, { recursive: true });

if (cmd === "check") {
  await plaid("/link/token/create", linkRequest({}));
  console.log("ready");
} else if (cmd === "link") {
  const { link_token, hosted_link_url } = await plaid("/link/token/create", linkRequest({
    hosted_link: {}, enable_multi_item_link: true, user_id: await plaidUser(),
  }));
  writeFileSync(PENDING, link_token);
  console.log(`Open this within 4 hours and add every bank, one after another: ${hosted_link_url}`);
} else if (cmd === "finish") {
  const { link_sessions = [] } = await plaid("/link/token/get", { link_token: readFileSync(PENDING, "utf8") });
  const added = link_sessions.flatMap(s => s.results?.item_add_results ?? []);
  if (!added.length) throw new Error("no bank linked yet — the owner hasn't finished the Plaid page");
  const saved = items();
  for (const { public_token, institution } of added) {
    const { access_token, item_id } = await plaid("/item/public_token/exchange", { public_token });
    if (!saved.some(i => i.item_id === item_id)) saved.push({ item_id, access_token, institution: institution?.name, cursor: null });
    console.log(`linked ${institution?.name ?? item_id}`);
  }
  writeFileSync(ITEMS, JSON.stringify(saved, null, 2), { mode: 0o600 });
} else if (cmd === "sync") {
  const saved = items();
  const balances = [];
  for (const item of saved) {
    let more = true;
    while (more) {
      const page = await plaid("/transactions/sync", { access_token: item.access_token, cursor: item.cursor ?? undefined });
      for (const t of [...page.added, ...page.modified]) appendFileSync(`${DIR}/transactions.jsonl`, JSON.stringify(t) + "\n");
      for (const t of page.removed) appendFileSync(`${DIR}/transactions.jsonl`, JSON.stringify({ removed: t.transaction_id }) + "\n");
      item.cursor = page.next_cursor;
      more = page.has_more;
    }
    const { accounts } = await plaid("/accounts/get", { access_token: item.access_token });
    balances.push(...accounts.map(a => ({ institution: item.institution, name: a.name, mask: a.mask, type: a.subtype, balances: a.balances })));
  }
  writeFileSync(ITEMS, JSON.stringify(saved, null, 2), { mode: 0o600 });
  writeFileSync(`${DIR}/balances.json`, JSON.stringify({ synced: new Date().toISOString(), accounts: balances }, null, 2));
  console.log(`synced ${saved.length} bank(s)`);
} else {
  throw new Error("usage: link | finish | sync | check");
}
