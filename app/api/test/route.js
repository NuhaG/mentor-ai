import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
    const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const result = await model.generateContent("greet the user");
    return Response.json({ text: result.response.text() });

}