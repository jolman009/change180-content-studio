# Generate Content API Contract

This repo currently expects a backend endpoint at `POST /generate-content`.

## Purpose

The endpoint supports two modes:

- `generate`: create a fresh structured draft from planning inputs
- `rewrite`: transform an existing generated draft using a tone or editing instruction

## Request Shape

### Generate

```json
{
  "mode": "generate",
  "input": {
    "topic": "Resetting your mindset after a hard week",
    "platform": "Instagram",
    "contentType": "Caption Post",
    "pillar": "Mindset Shifts",
    "goal": "Engagement",
    "tone": "Grounded, hopeful, direct",
    "context": "Speak to adults feeling stuck and overwhelmed."
  },
  "brandProfile": {
    "brandName": "Change180",
    "audience": "Adults seeking clarity, growth, and life direction",
    "mission": "Help people renew mindset, gain clarity, and take practical steps toward lasting change.",
    "toneRules": "Grounded, hopeful, direct, reflective, practical. Avoid fluff and hype.",
    "preferredCtas": "Book a session, reflect on this, save this post, share with someone who needs it.",
    "bannedPhrases": "Boss babe, hustle harder, healing vibes only, manifest it all"
  }
}
```

### Rewrite

```json
{
  "mode": "rewrite",
  "input": {
    "topic": "Resetting your mindset after a hard week",
    "platform": "Instagram",
    "contentType": "Caption Post",
    "pillar": "Mindset Shifts",
    "goal": "Engagement",
    "tone": "Grounded, hopeful, direct",
    "context": "Speak to adults feeling stuck and overwhelmed."
  },
  "currentOutput": {
    "hook": "You do not need a new life overnight. You need one honest step today.",
    "caption": "Growth is rarely loud...",
    "cta": "Save this for the day you need a reset.",
    "hashtags": ["#Change180", "#MindsetShift"],
    "visual": "Clean branded quote graphic."
  },
  "action": {
    "id": "clearer",
    "instruction": "Clarify the message and remove ambiguity."
  },
  "brandProfile": {
    "brandName": "Change180",
    "audience": "Adults seeking clarity, growth, and life direction",
    "mission": "Help people renew mindset, gain clarity, and take practical steps toward lasting change.",
    "toneRules": "Grounded, hopeful, direct, reflective, practical. Avoid fluff and hype.",
    "preferredCtas": "Book a session, reflect on this, save this post, share with someone who needs it.",
    "bannedPhrases": "Boss babe, hustle harder, healing vibes only, manifest it all"
  }
}
```

## Response Shape

The frontend accepts either of these shapes:

### Preferred

```json
{
  "output": {
    "hook": "You do not need a new life overnight. You need one honest step today.",
    "caption": "Growth is rarely loud...",
    "cta": "Save this for the day you need a reset.",
    "hashtags": ["#Change180", "#MindsetShift"],
    "visual": "Clean branded quote graphic."
  }
}
```

### Backward-Compatible

```json
{
  "hook": "You do not need a new life overnight. You need one honest step today.",
  "caption": "Growth is rarely loud...",
  "cta": "Save this for the day you need a reset.",
  "hashtags": ["#Change180", "#MindsetShift"],
  "visual": "Clean branded quote graphic."
}
```

## Failure Behavior

- Return a non-2xx status for generation failures
- Include a JSON body with `message` when possible
- The frontend retries failed requests up to 2 attempts before surfacing the error

## Tone Actions

Supported rewrite action ids:

- `softer`
- `stronger`
- `clearer`
- `shorter`
- `more_direct`
