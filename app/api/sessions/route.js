import dbConnect from "@/lib/db";
import Session from "@/models/Session";

export async function GET() {
    try {
        await dbConnect();
        const sessions = await Session.find().sort({ createdAt: -1 });
        return new Response(JSON.stringify({ sessions }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const { _id, personaId, personaName, conversation } = await req.json();

        let session = _id
            ? await Session.findByIdAndUpdate(_id, { conversation, personaName }, { new: true })
            : await Session.findOneAndUpdate(
                { personaId },
                { conversation, personaName, createdAt: new Date() },
                { new: true, upsert: true }
            );

        return new Response(JSON.stringify({ session }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
