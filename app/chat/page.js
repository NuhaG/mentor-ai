"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { personas } from "@/lib/personas";

import Sidebar from "@/components/chat/Sidebar";
import Header from "@/components/chat/Header";
import Message from "@/components/chat/Message";
import ChatInput from "@/components/chat/ChatInput";

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const bottomRef = useRef(null);

    const searchParams = useSearchParams();
    const personaId = searchParams?.get("personaId");
    const persona = personas.find((p) => String(p.id) === String(personaId)) || null;

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch("/api/sessions");
                const data = await res.json();
                if (data.sessions) setSessions(data.sessions);
            } catch {}
        };
        fetchSessions();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!persona || messages.length === 0) return;

            const existing = sessions.find((s) => s.personaId === persona.id);

            const res = await fetch("/api/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    _id: existing?._id,
                    personaId: persona.id,
                    personaName: persona.name,
                    conversation: messages,
                }),
            });

            const data = await res.json();
            if (data.session) {
                setSessions((prev) =>
                    existing
                        ? prev.map((s) => (s._id === existing._id ? data.session : s))
                        : [...prev, data.session]
                );
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [messages, persona, sessions]);

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
                body: JSON.stringify({ message: text, persona: persona?.prompt || "" }),
            });
            const data = await res.json();
            setMessages((p) => [...p, { role: "ai", text: data.reply }]);
        } catch {
            setMessages((p) => [...p, { role: "ai", text: "Error: Could not get response." }]);
        }
        setLoading(false);
    };

    const loadSession = (s) => {
        setMessages(s.conversation || []);
        setSidebarOpen(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-white dark:bg-gray-950">

            <Sidebar
                sidebarOpen={sidebarOpen}
                sessions={sessions}
                loadSession={loadSession}
                close={() => setSidebarOpen(false)}
            />

            <Header persona={persona} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="w-full flex-1 pt-16 pb-24 px-6 flex flex-col space-y-4">
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

                {loading && <div className="text-sm text-gray-500">AI is typing...</div>}
                <div ref={bottomRef} />
            </div>

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
