import dbConnect from "@/lib/db";
import Session from "@/models/Session";

export async function GET() {
    try {
        await dbConnect();

        // fetch and ret all sessions sorted by newest
        const sessions = await Session.find().sort({ createdAt: -1 });

        return new Response(
            JSON.stringify({ sessions }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}

export async function POST(req) {
    try {
        await dbConnect();

        const { _id, personaId, personaName, conversation } = await req.json();

        let session;

        if (_id) {
            // update existing by _id
            session = await Session.findByIdAndUpdate(
                _id,
                { conversation, personaName },
                { new: true }
            );
        } else {
            // if no _id, update by persona.id or new
            session = await Session.findOneAndUpdate(
                { personaId },
                { conversation, personaName, createdAt: new Date() },
                { new: true, upsert: true } // upsert: create new if not found
            );
        }

        return new Response(
            JSON.stringify({ session }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();

        const { _id } = await req.json();

        if (!_id) {
            return new Response(JSON.stringify({ error: "Session ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // find by _id and del
        await Session.findByIdAndDelete(_id);

        return new Response(JSON.stringify({ message: "Session deleted" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}