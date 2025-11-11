import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { message } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const result = await model.generateContent(message);

  return new Response(JSON.stringify({ reply: result.response.text() }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
