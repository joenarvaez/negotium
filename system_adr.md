# System ADR

Diagrams: see [`readme.md`](readme.md).

## Architecture

### §1. LiteLLM is the only model gateway

*Why.* One place to route, mask and log. Every client (Goose, Nanobrowser, OpenCode, Open Design, OpenClaw, Home Assistant) talks to the same OpenAI-compatible endpoint.

Every model call goes through LiteLLM. No client calls a model provider directly.

### §2. Only masked prompts leave the server

*Why.* Rented models are the cheapest frontier intelligence, and they run in China. They get the task, not the person.

Presidio runs as a LiteLLM guardrail and swaps personal data for placeholders (`<PERSON_1>`) before a prompt goes to Qwen or DeepSeek. LiteLLM puts the real values back into the reply (`output_parse_pii`).

### §3. High-risk work stays local

*Why.* Masking hides names and numbers, not what the task is about. Some tasks are too sensitive to send out even masked.

High-risk tasks (health, finances, passwords) run on the small local Qwen in Ollama. Everything else can go to a rented model, masked.

### §4. Model per tool

*Why.* Qwen is strongest at vision and computer use; DeepSeek is the best-value coder and designer.

| Tool | Model |
|---|---|
| OpenClaw, Nanobrowser | Qwen |
| OpenCode, Open Design, Goose | DeepSeek |
| Hold detection, high-risk tasks | small local Qwen |

### §5. Tailscale is the only door

*Why.* No ports open to the internet for the laptop or phone.

The laptop and phone reach the server only over Tailscale. The smart speaker is on the LAN.

### §6. Home Assistant owns voice, OpenClaw is the brain

*Why.* One wake word. Simple commands run in milliseconds without a model; everything else gets full memory and tools.

Home Assistant matches deterministic intents first. Anything it can't match falls back to OpenClaw. Speech-to-text (Whisper) and text-to-speech (Kokoro) run on the server.

### §7. Payments

*Why.* A one-time purchase from a merchant you don't have an account with is where a real card gets exposed. Everywhere else the card already lives inside the merchant's account.

- One-time payments: a privacy.com virtual card, created by OpenClaw.
- Everything else: OpenClaw's internal browser stays logged into your accounts (DoorDash, etc.) and uses their saved payment methods.
