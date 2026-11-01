---
name: virtual-card
description: "Make a privacy.com virtual card for a one-time or trial payment: locked to one merchant, with a spending limit."
---

# Virtual card

Use this for one-time payments and free trials (system_adr.md §6). Accounts the owner already pays from
keep their saved payment method — don't make a card for those.

```sh
node /home/node/.openclaw/workspace/skills/virtual-card/privacy-card.mjs new "<merchant>" <limit dollars> [TRANSACTION|MONTHLY|ANNUALLY|FOREVER]
node /home/node/.openclaw/workspace/skills/virtual-card/privacy-card.mjs close <card token>
node /home/node/.openclaw/workspace/skills/virtual-card/privacy-card.mjs list
```

`new` prints the card token, number, CVV and expiry. The card locks to the first merchant that charges it.
For a free trial, use a limit of 1 dollar with `FOREVER`, so the renewal is declined.
