"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { personas } from "@/lib/personas";
import { MdSend, MdArrowBack } from "react-icons/md";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const searchParams = useSearchParams();
    const personaId = searchParams?.get("personaId");
    const persona = personas.find((p) => String(p.id) === String(personaId)) || null;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-white dark:bg-gray-950">
            {/* Fixed header */}
            <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-40">
                <div className="w-full px-6 py-2 flex items-center gap-3">
                    <Link href="/" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <MdArrowBack className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                    </Link>
                    <img
                        src={persona?.avatar || 'https://api.dicebear.com/9.x/bottts/svg?seed=Default&backgroundColor=b6e3f4'}
                        alt={persona ? persona.name : 'AI'}
                        className="w-10 h-10 rounded-full ring-1 ring-gray-100 dark:ring-gray-800 object-cover"
                    />
                    <div className="min-w-0">
                        <div className="text-lg font-semibold truncate">{persona ? persona.name : 'AI Chat'}</div>
                        {persona && <div className="text-xs text-gray-500 truncate">{persona.description}</div>}
                    </div>
                </div>
            </div>

            <div className="w-full flex-1">
                <div className="flex flex-col h-full">
                    <div className="pt-16 pb-24 px-6 space-y-4 flex-1">
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
                                            <img
                                                src={persona?.avatar || 'https://api.dicebear.com/9.x/bottts/svg?seed=AI&backgroundColor=b6e3f4'}
                                                alt="ai"
                                                className="w-8 h-8 rounded-full ring-1 ring-gray-100 dark:ring-gray-800 object-cover mt-1"
                                            />
                                            <div className="inline-block max-w-[75%]">
                                                <div className="p-3 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                                                <ReactMarkdown
                                                    components={{
                                                        code({ node, inline, className, children, ...props }) {
                                                            return !inline ? (
                                                                <pre className="rounded-lg my-2 overflow-x-auto bg-gray-900 text-white p-3 font-mono text-sm" {...props}>
                                                                    <code>{String(children).replace(/\n$/, "")}</code>
                                                                </pre>
                                                            ) : (
                                                                <code className="bg-gray-700 rounded px-1.5 py-0.5 text-sm font-mono" {...props}>
                                                                    {children}
                                                                </code>
                                                            );
                                                        },
                                                        a: ({ node, children, ...props }) => (
                                                            <a className="text-blue-400 hover:underline" {...props}>
                                                                {children}
                                                            </a>
                                                        ),
                                                        ul: ({ node, children, ...props }) => (
                                                            <ul className="list-disc list-inside my-2" {...props}>
                                                                {children}
                                                            </ul>
                                                        ),
                                                        ol: ({ node, children, ...props }) => (
                                                            <ol className="list-decimal list-inside my-2" {...props}>
                                                                {children}
                                                            </ol>
                                                        ),
                                                        li: ({ node, children, ...props }) => (
                                                            <li className="ml-4" {...props}>
                                                                {children}
                                                            </li>
                                                        ),
                                                        h1: ({ node, children, ...props }) => (
                                                            <h1 className="text-xl font-bold my-2" {...props}>{children}</h1>
                                                        ),
                                                        h2: ({ node, children, ...props }) => (
                                                            <h2 className="text-lg font-semibold my-2" {...props}>{children}</h2>
                                                        ),
                                                        p: ({ node, children, ...props }) => (
                                                            <p className="my-1" {...props}>{children}</p>
                                                        ),
                                                    }}
                                                >
                                                    {m.text}
                                                </ReactMarkdown>
                                            </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={i} className="flex items-end gap-3 justify-end">
                                        <div className="inline-block max-w-[75%]">
                                            <div className="p-3 rounded-lg wrap-break-words whitespace-pre-wrap shadow-sm bg-linear-to-br from-blue-600 to-purple-600 text-white">
                                                {m.text}
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold mt-1">You</div>
                                    </div>
                                );
                            })
                        )}

                        {loading && <div className="text-sm text-gray-500">AI is typing...</div>}
                        <div ref={bottomRef} />
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-40">
                <div className="w-full px-6 py-3">
                    <div className="flex gap-3 items-end">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            className="flex-1 p-3 border rounded-l-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none"
                            placeholder="Type your message... (Ctrl + Enter to send)"
                        />

                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            className="shrink-0 w-10 h-10 bg-blue-600 text-white rounded-r-full flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 transition-colors"
                            title="Send (Ctrl + Enter)"
                        >
                            <MdSend className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
