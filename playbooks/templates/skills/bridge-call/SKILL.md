---
name: bridge-call
description: "Hand a live phone call to the owner's mobile once a real person picks up (after waiting on hold or a phone menu)."
metadata: { "openclaw": { "emoji": "🔀", "requires": { "config": ["plugins.entries.voice-call.enabled"] } } }
---

# Bridge call

Use this when you are on a call for the owner and a real person is now on the line.
Hold music, recorded messages and phone menus are not a person — keep waiting.

1. Tell the person, with `voice_call` `speak_to_user`: "One moment please, I'm connecting you now."
2. Get the Twilio call ID with `voice_call` `get_status` — it is `providerCallId` (starts with `CA`).
3. Run `sh /home/node/.openclaw/workspace/skills/bridge-call/bridge.sh <providerCallId>`.

The owner's mobile rings and the call is theirs; you are off the line. Then send the owner a
short summary of the call so far.
