"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { personas } from "@/lib/personas";
import { MdSend, MdArrowBack, MdMenu, MdClose } from "react-icons/md";
import ReactMarkdown from "react-markdown";

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

    // Fetch sessions
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch("/api/sessions");
                const data = await res.json();
                if (data.sessions) setSessions(data.sessions);
            } catch (err) {
                console.error("Failed to fetch sessions:", err);
            }
        };
        fetchSessions();
    }, []);

    // Scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Auto Save One entire conversation
    useEffect(() => {
        const autoSave = async () => {
            if (!persona || messages.length === 0) return;

            try {
                const existingSession = sessions.find((s) => s.personaId === persona.id);

                const res = await fetch("/api/sessions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        _id: existingSession?._id,
                        personaId: persona.id,
                        personaName: persona.name,
                        conversation: messages,
                    }),
                });

                let data;
                try {
                    data = await res.json();
                } catch {
                    console.warn("Failed to parse JSON response.");
                    data = {};
                }

                if (res.ok && data.session) {
                    setSessions((prev) => {
                        if (existingSession) {
                            return prev.map((s) => (s._id === existingSession._id ? data.session : s));
                        } else {
                            return [...prev, data.session];
                        }
                    });
                }
            } catch (err) {
                console.error("Auto-save error:", err);
            }
        };

        const timer = setTimeout(autoSave, 1000);
        return () => clearTimeout(timer);
    }, [messages, persona, sessions]);

    // Send message
    const sendMessage = async () => {
        if (!input.trim()) return;
        const text = input;
        setMessages((prev) => [...prev, { role: "user", text }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, persona: persona?.prompt || "" }),
            });
            const data = await res.json();
            setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
        } catch {
            setMessages((prev) => [...prev, { role: "ai", text: "Error: Could not get response." }]);
        } finally {
            setLoading(false);
        }
    };

    const loadSession = (session) => {
        setMessages(session.conversation || []);
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
            {/* Sidebar on the right */}
            <div className={`fixed top-0 bottom-0 right-0 w-64 bg-gray-100 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Sessions</h3>
                    <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                        <MdClose className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-5rem)]">
                    {sessions.length === 0 ? (
                        <p className="text-sm text-gray-500">No sessions yet</p>
                    ) : (
                        sessions.map((session) => (
                            <button key={session._id} onClick={() => loadSession(session)} className="w-full text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                <div className="text-sm font-medium truncate">{session.personaName}</div>
                                <div className="text-xs text-gray-500 truncate">{new Date(session.createdAt).toLocaleDateString()}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">{session.conversation?.length || 0} messages</div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Header with persona info on left */}
            <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-40 flex items-center px-6 py-2 justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <MdArrowBack className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                    </Link>
                    <img src={persona?.avatar || 'https://api.dicebear.com/9.x/bottts/svg?seed=Default&backgroundColor=b6e3f4'} alt={persona?.name || 'AI'} className="w-10 h-10 rounded-full ring-1 ring-gray-100 dark:ring-gray-800 object-cover" />
                    <div className="min-w-0">
                        <div className="text-lg font-semibold truncate">{persona?.name || 'AI Chat'}</div>
                        {persona && <div className="text-xs text-gray-500 truncate">{persona.description}</div>}
                    </div>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <MdMenu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </button>
            </div>

            {/* Chat messages */}
            <div className="w-full flex-1 pt-16 pb-24 px-6 flex flex-col space-y-4">
                {messages.length === 0 ? (
                    <div className="h-[calc(100vh-8rem)] flex items-center justify-center text-center">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Welcome Back</h1>
                            <p className="text-lg text-gray-500 dark:text-gray-400">Start by typing below</p>
                        </div>
                    </div>
                ) : (
                    messages.map((m, i) => {
                        const isUser = m.role === "user";
                        if (!isUser) {
                            return (
                                <div key={i} className="flex items-start gap-3 justify-start">
                                    <img src={persona?.avatar || 'https://api.dicebear.com/9.x/bottts/svg?seed=AI&backgroundColor=b6e3f4'} alt="ai" className="w-8 h-8 rounded-full ring-1 ring-gray-100 dark:ring-gray-800 object-cover mt-1" />
                                    <div className="inline-block max-w-[75%] p-3 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                                        <ReactMarkdown>{m.text}</ReactMarkdown>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div key={i} className="flex items-end gap-3 justify-end">
                                <div className="inline-block max-w-[75%] p-3 rounded-lg wrap-break-words whitespace-pre-wrap shadow-sm bg-linear-to-br from-blue-600 to-purple-600 text-white">{m.text}</div>
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold mt-1">You</div>
                            </div>
                        );
                    })
                )}
                {loading && <div className="text-sm text-gray-500">AI is typing...</div>}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-40 px-6 py-3">
                <div className="flex gap-3 items-end">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        className="flex-1 p-3 border rounded-l-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none"
                        placeholder="Type your message... (Ctrl + Enter to send)"
                    />
                    <button onClick={sendMessage} disabled={!input.trim() || loading} className="shrink-0 w-10 h-10 bg-blue-600 text-white rounded-r-full flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 transition-colors" title="Send (Ctrl + Enter)">
                        <MdSend className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
