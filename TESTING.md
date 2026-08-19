# Draftly verification checklist

## Automated checks

- [x] JavaScript parses successfully with Node syntax checking.
- [ ] No API secret is committed to HTML, CSS, JavaScript, README, or `.env` files.
- [ ] Production server loads configuration from environment variables and does not return the secret to browsers.

## Core draft flow

- [ ] Empty instruction: focus returns to the input and a helpful validation message appears.
- [ ] Email: generates a polished email with a subject when the request needs one.
- [ ] Slack message: produces a concise chat-appropriate message.
- [ ] Text message: produces a natural, compact text.
- [ ] Tone selections affect the generated wording (warm, professional, casual, apologetic).
- [ ] Length selections constrain response length (brief, balanced, detailed).
- [ ] AI output includes a genuine compose, critique, and revision cycle.
- [ ] Review card reflects the actual critique instead of fixed placeholder statements.

## API and resilience

- [ ] A valid configured Groq key successfully reaches the server/API route and returns a draft.
- [ ] Invalid/missing key yields a clear recovery message and never exposes the key.
- [ ] API network failures are handled without leaving the Compose button disabled.
- [ ] Unexpected/empty API response is handled safely.
- [ ] The browser makes no direct request containing a Groq key when using the server backend.

## Interaction and usability

- [ ] Copy and Use draft copy the complete generated text; clipboard failure is handled gracefully.
- [ ] Revise tone brings the user back to the controls and preserves the original instruction.
- [ ] New draft clears/hides the result as intended.
- [ ] Settings modal can be opened/closed with keyboard and pointer.
- [ ] Layout remains usable at phone width and desktop width.
- [ ] All buttons have accessible labels, readable focus states, and sufficient contrast.

## Manual test prompts

1. "Tell my professor I need two extra days for my assignment because I was sick."
2. "Ask the team to review the release notes before 4 PM."
3. "Tell Sam I will be 15 minutes late for dinner."
