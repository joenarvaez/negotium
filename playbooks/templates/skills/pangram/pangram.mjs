// Pangram AI-text detection over its async REST API. Reads the draft on stdin.
// `check` only confirms the key works.
const KEY = process.env.PANGRAM_API_KEY;
const API = "https://text.external-api.pangram.com";
const headers = { "x-api-key": KEY, "Content-Type": "application/json" };

async function call(method, path, body) {
  const res = await fetch(API + path, { method, headers, body: body && JSON.stringify(body) });
  if (!res.ok) throw new Error(`pangram ${res.status}: ${await res.text()}`);
  return res.json();
}

if (process.argv[2] === "check") {
  await call("GET", "/models");
  console.log("ready");
} else {
  let text = "";
  for await (const chunk of process.stdin) text += chunk;
  if (!text.trim()) throw new Error("pipe the draft in on stdin");
  const { task_id } = await call("POST", "/task", { text, model: "default", public_dashboard_link: false });
  let result;
  for (let tries = 0; tries < 150; tries++) {
    result = await call("GET", `/task/${task_id}`);
    if (result.stage === "STAGE_SUCCESS") break;
    if (result.stage === "STAGE_FAILED") throw new Error(`pangram task failed: ${JSON.stringify(result)}`);
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log(`${result.prediction_short}: human ${result.fraction_human.toFixed(2)}, AI ${result.fraction_ai.toFixed(2)}, AI-assisted ${result.fraction_ai_assisted.toFixed(2)}`);
  for (const w of result.windows ?? []) {
    if (w.label !== "Human Written") console.log(`- [${w.label} ${w.ai_assistance_score.toFixed(2)}] ${w.text.trim()}`);
  }
}
