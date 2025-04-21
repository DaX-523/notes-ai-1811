/**
 * Groq API integration for note summarization
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function summarizeWithGroq(content: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    console.error("Groq API key is missing");
    return "Unable to generate summary: API key is missing.";
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that summarizes note's description in a concise and informative way.",
          },
          {
            role: "user",
            content: `Please summarize the following description:\n\n${content}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Groq API error: ${response.status} ${errorData}`);
    }

    const data = (await response.json()) as GroqResponse;
    console.log(data);
    return data.choices[0]?.message?.content || "Unable to generate summary.";
  } catch (error) {
    console.error("Error summarizing with Groq:", error);
    return "An error occurred while generating the summary.";
  }
}
