"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { personas } from "@/lib/personas";

import Sidebar from "@/components/chat/Sidebar";
import Header from "@/components/chat/Header";
import Message from "@/components/chat/Message";
import ChatInput from "@/components/chat/ChatInput";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const bottomRef = useRef(null);

    // get the curr persona from the query
    const searchParams = useSearchParams();
    const personaId = searchParams?.get("personaId");
    const persona = personas.find((p) => String(p.id) === String(personaId)) || null;

    // fetch all sessions from db
    useEffect(() => {
        const fetchSessions = async () => {
            const res = await fetch("/api/sessions");
            const data = await res.json();
            if (data.sessions) setSessions(data.sessions);
        };
        fetchSessions();
    }, []);

    // scroll to latest
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // auto save one entire session
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!persona || messages.length === 0) return;

            const res = await fetch("/api/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    _id: currentSessionId,
                    personaId: persona.id,
                    personaName: persona.name,
                    conversation: messages,
                }),
            });

            const data = await res.json();

            if (data.session) {
                setCurrentSessionId(data.session._id); // track current session
                setSessions(prev => {
                    const exists = prev.find(s => s._id === data.session._id);
                    if (exists) return prev.map(s => s._id === exists._id ? data.session : s);
                    return [...prev, data.session];
                });
            }

        }, 1000);

        return () => clearTimeout(timer);
    }, [messages, persona, currentSessionId]);

    // delete saved
    const deleteSession = async (_id) => {
        try {
            const res = await fetch("/api/sessions", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id }),
            });

            if (res.ok) setSessions((prev) => prev.filter((s) => s._id !== _id));
            else {
                const data = await res.json();
                console.error("Failed to delete session:", data.error || res.statusText);
            }
        } catch (err) {
            console.error("Error deleting session:", err);
        }
    };

    // mess handler
    const sendMessage = async () => {
        if (!input.trim()) return;

        const text = input;
        setMessages((p) => [...p, { role: "user", text }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, persona: persona?.prompt || "", history: messages }),
            });
            const data = await res.json();
            setMessages((p) => [...p, { role: "ai", text: data.reply, isNew: true }]);
        } catch {
            setMessages((p) => [...p, { role: "ai", text: "Error: Could not get response." }]);
        }
        setLoading(false);
    };

    // open saved
    const loadSession = (s) => {
        setMessages(s.conversation || []);
        setCurrentSessionId(s._id);
        setSidebarOpen(false);
    };

    // ctrl + enter send
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // new session for curr user
    const newSession = () => {
        setMessages([]);
        setCurrentSessionId(null);
        setSidebarOpen(false);
    };

    // sess of curr 
    const personaSessions = sessions.filter(s => s.personaId === persona?.id);

    return (
        <div className="bg-white dark:bg-gray-950">
            {/* All Saved Sessions */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                sessions={personaSessions}
                loadSession={loadSession}
                close={() => setSidebarOpen(false)}
                deleteSession={deleteSession}
                newSession={newSession}
            />

            {/* Header with persona info */}
            <Header persona={persona} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            {/* Message Window */}
            <div className="w-full flex-1 pt-16 pb-24 px-6 flex flex-col space-y-4 mt-6">
                {messages.length === 0 ? (
                    <div className="h-[calc(100vh-8rem)] flex items-center justify-center text-center">
                        <div>
                            <h1 className="text-4xl font-extrabold mb-3">Welcome Back</h1>
                            <p className="text-lg text-gray-500">Start by typing below</p>
                        </div>
                    </div>
                ) : (
                    messages.map((m, i) => (
                        <Message key={i} m={m} persona={persona} />
                    ))
                )}

                {loading && <div className="text-lg flex items-center gap-1 h-15">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce animation-delay-400">.</span>
                    <span className="animate-bounce animation-delay-600">.</span>
                </div>}
                <div ref={bottomRef} />
            </div>

            {/* Text and Voice Input */}
            <ChatInput
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
                loading={loading}
                handleKeyDown={handleKeyDown}
            />
        </div>
    );
}
