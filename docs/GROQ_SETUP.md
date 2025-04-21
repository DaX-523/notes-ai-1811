# Setting Up Groq AI Integration

This application uses Groq's AI API to summarize your notes. Follow these steps to set up the integration:

## 1. Get a Groq API Key

1. Go to [Groq's website](https://console.groq.com/keys) and create an account if you don't have one.
2. Generate a new API key from your dashboard.
3. Copy the API key.

## 2. Configure Your Environment

1. Open the `.env` file in the root directory of the project.
2. Add your Groq API key to the `NEXT_PUBLIC_GROQ_API_KEY` variable:

```
NEXT_PUBLIC_GROQ_API_KEY=your_api_key_here
```

3. Save the file.

## 3. Restart Your Development Server

After setting up the API key, restart your development server to apply the changes:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Using the Summary Feature

1. Once configured, open the Notes Summary dialog from your notes list.
2. The application will automatically generate a summary of your notes using Groq's AI.
3. You can regenerate the summary by clicking the "Regenerate" button.

## Troubleshooting

- If you see an error message like "API key is missing," check that your `.env` file has the correct API key.
- If summaries aren't generating, ensure your internet connection is working and that your Groq API key is valid.
- For more advanced issues, check the browser console for error messages that can help diagnose the problem.
