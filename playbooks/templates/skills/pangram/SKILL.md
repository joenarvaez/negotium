---
name: pangram
description: "Check writing that goes to a person (cover letter, recruiter note, email) for AI-sounding text with Pangram."
---

# Pangram

Run before sending anything the owner will put their name on.

```sh
node /home/node/.openclaw/workspace/skills/pangram/pangram.mjs < draft.txt
```

It prints how much reads as human and every flagged passage. Show the owner the flagged passages
verbatim and ask them to rewrite those in their own words — don't rewrite them yourself; a machine
rewrite gets flagged again.
