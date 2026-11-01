// privacy.com virtual cards over its REST API. `check` only confirms the key works.
const KEY = process.env.PRIVACY_API_KEY;
const API = "https://api.privacy.com/v1";
const [cmd, ...args] = process.argv.slice(2);

async function call(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `api-key ${KEY}`, "Content-Type": "application/json" },
    body: body && JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`privacy.com ${res.status}: ${await res.text()}`);
  return res.json();
}

const show = c =>
  `${c.token}  ${c.memo}  ${c.state}  limit $${c.spend_limit / 100}/${c.spend_limit_duration}` +
  (c.pan ? `  number ${c.pan}  cvv ${c.cvv}  exp ${c.exp_month}/${c.exp_year}` : `  last4 ${c.last_four}`);

if (!KEY) throw new Error("PRIVACY_API_KEY is not set");
if (cmd === "check") {
  await call("GET", "/cards?page_size=1");
  console.log("ready");
} else if (cmd === "new") {
  const [memo, dollars, duration = "FOREVER"] = args;
  if (!memo || !(Number(dollars) > 0)) throw new Error('usage: new "<merchant>" <limit dollars> [duration]');
  const card = await call("POST", "/cards", {
    type: "MERCHANT_LOCKED", memo, spend_limit: Math.round(Number(dollars) * 100), spend_limit_duration: duration,
  });
  console.log(show(card));
} else if (cmd === "close") {
  console.log(show(await call("PATCH", `/cards/${args[0]}`, { state: "CLOSED" })));
} else if (cmd === "list") {
  for (const c of (await call("GET", "/cards?page_size=50")).data) console.log(show(c));
} else {
  throw new Error("usage: new | close | list | check");
}
