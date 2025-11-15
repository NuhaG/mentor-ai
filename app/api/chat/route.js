import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { message, persona } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  // prompt contains persona, and user message
  const prompt = `${persona}
  Respond to the user in character, conversationally: 
  User: ${message}
  Mentor: 
  `

  // gen res using prompt
  const result = await model.generateContent(prompt);

  // extract textual reply
  return new Response(JSON.stringify({ reply: result.response.text() }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
