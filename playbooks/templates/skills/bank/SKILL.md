---
name: bank
description: "The owner's bank accounts via Plaid: link a bank, sync transactions and balances into workspace/finance."
---

# Bank

Raw bank data stays on this server (system_adr.md §3). It lives in `/home/node/.openclaw/workspace/finance/`:
`transactions.jsonl` (one Plaid transaction per line, newest last) and `balances.json` (latest balances).

```sh
node /home/node/.openclaw/workspace/skills/bank/plaid.mjs link     # prints a URL (valid 4 hours); the owner adds every bank there
node /home/node/.openclaw/workspace/skills/bank/plaid.mjs finish   # after the owner says they're done: saves the connection
node /home/node/.openclaw/workspace/skills/bank/plaid.mjs sync     # pulls new transactions and balances (also runs daily)
```

To add more banks later, run `link` and `finish` again.
