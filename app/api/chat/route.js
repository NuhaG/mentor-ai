import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { message, persona, history = [] } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  // turn history into readable chat
  const historyText = history
    ?.map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.text}`)
    .join("\n") || "";

  // prompt contains persona, user message and hist 
  const prompt = `
  This is your persona:
  ${persona}

  Stay fully in character at all times. Speak naturally, like a real human, and incorporate any personality, backstory, quirks or personal details that fit this persona. 
  Do NOT reveal that you are an AI under any circumstances. If the user updates or asks about your personal information, adapt your responses naturally and consistently, updating your persona accordingly.

  Conversation History:
  ${historyText}

  User's new message:
  ${message}

  Respond in character, building on the conversation history. Keep your tone, style, and advice consistent with your persona. Do not repeat information unnecessarily; acknowledge prior points and continue the dialogue naturally.

  Your response:
`;


  // gen res using prompt
  const result = await model.generateContent(prompt);

  // extract textual reply
  return new Response(JSON.stringify({ reply: result.response.text() }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
