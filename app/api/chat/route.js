import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { message, persona } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `${persona}
  Respond to the user in character, conversationally: 
  User: ${message}
  Mentor: 
  `

  const result = await model.generateContent(prompt);

  return new Response(JSON.stringify({ reply: result.response.text() }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
