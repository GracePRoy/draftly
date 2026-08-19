# Draftly — Email / Message Draft Agent

Draftly is a local full-stack app. It needs Node.js 18 or newer.

## Connect Groq

1. Install Node.js 18 or newer from [nodejs.org](https://nodejs.org/) if it is not already installed.
2. In this project folder, run `npm install`.
3. Copy `.env.example` to a new file named `.env`.
4. Put a newly generated Groq key after `GROQ_API_KEY=` in `.env`.
5. Run `npm start`, then open `http://localhost:3000`.

The key is never sent to the browser and `.env` is ignored by Git. Do not use the key previously shared in chat; revoke it and generate a replacement first.

## Included functionality

- Email, Slack, and text-message modes
- Warm, professional, casual, and apologetic tone choices
- Brief, balanced, and detailed output lengths
- Groq-powered drafting through a secure local backend
- A real self-critique/revision loop plus review for clarity, tone, and completeness
- Copy, revise, and start-over actions
- Responsive mobile layout

## Deploy to Render

1. Create a private GitHub repository and upload this project (never upload `.env`).
2. In Render, choose **New → Blueprint** and connect that repository.
3. Enter a newly generated Groq key when Render asks for `GROQ_API_KEY`.
4. Deploy. Render will provide a public HTTPS link.

The repository includes `Dockerfile` and `render.yaml` for this deployment. Keep the Groq key only in Render's encrypted environment variable—never commit it.
