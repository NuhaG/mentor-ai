"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { MdSend } from "react-icons/md";

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleTextAreaInput = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        const text = input;
        setMessages([...messages, { role: "user", text }]);
        setInput("");

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
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
        <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-200px)]">
                            <div className="text-center px-4">
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome</h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400">Start a conversation by typing a message below!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto w-full">
                            {messages.map((msg, i) => {
                                const isUser = msg.role === "user";
                                return (
                                    <div key={i} className={`flex gap-3 sm:gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
                                        {!isUser && (
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                                                AI
                                            </div>
                                        )}
                                        <div className={`${isUser ? "max-w-xs sm:max-w-lg" : "max-w-2xl"} wrap-break-word`}>
                                            <div
                                                className={`px-4 sm:px-5 py-3 sm:py-4 rounded-2xl text-sm sm:text-base leading-relaxed ${isUser
                                                    ? "bg-blue-600 text-white rounded-br-3xl"
                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-3xl"
                                                    }`}
                                            >
                                                <ReactMarkdown
                                                    components={{
                                                        code({ node, inline, className, children, ...props }) {
                                                            return !inline ? (
                                                                <pre
                                                                    className="rounded-lg my-3 overflow-x-auto bg-gray-900 text-white p-3 sm:p-4 font-mono text-xs sm:text-sm leading-relaxed"
                                                                    {...props}
                                                                >
                                                                    <code>
                                                                        {String(children).replace(/\n$/, "")}
                                                                    </code>
                                                                </pre>
                                                            ) : (
                                                                <code className={`rounded px-2 py-1 text-xs sm:text-sm font-mono ${isUser ? "bg-blue-700 bg-opacity-50" : "bg-gray-200 dark:bg-gray-700"}`} {...props}>
                                                                    {children}
                                                                </code>
                                                            );
                                                        },
                                                        a: ({ node, children, ...props }) => (
                                                            <a className={`hover:underline font-medium ${isUser ? "text-blue-100" : "text-blue-600 dark:text-blue-400"}`} {...props}>
                                                                {children}
                                                            </a>
                                                        ),
                                                        table: ({ node, children, ...props }) => (
                                                            <div className="overflow-x-auto my-3">
                                                                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm" {...props}>
                                                                    {children}
                                                                </table>
                                                            </div>
                                                        ),
                                                        th: ({ node, children, ...props }) => (
                                                            <th className={`border border-gray-300 dark:border-gray-700 px-3 py-2 text-left font-semibold ${isUser ? "bg-blue-700 bg-opacity-30" : "bg-gray-200 dark:bg-gray-700"}`} {...props}>
                                                                {children}
                                                            </th>
                                                        ),
                                                        td: ({ node, children, ...props }) => (
                                                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2" {...props}>
                                                                {children}
                                                            </td>
                                                        ),
                                                        ul: ({ node, children, ...props }) => (
                                                            <ul className="list-disc list-inside my-2 space-y-1" {...props}>
                                                                {children}
                                                            </ul>
                                                        ),
                                                        ol: ({ node, children, ...props }) => (
                                                            <ol className="list-decimal list-inside my-2 space-y-1" {...props}>
                                                                {children}
                                                            </ol>
                                                        ),
                                                        li: ({ node, children, ...props }) => (
                                                            <li {...props}>
                                                                {children}
                                                            </li>
                                                        ),
                                                        h1: ({ node, children, ...props }) => (
                                                            <h1 className="text-lg sm:text-xl font-bold my-3 mt-4" {...props}>{children}</h1>
                                                        ),
                                                        h2: ({ node, children, ...props }) => (
                                                            <h2 className="text-base sm:text-lg font-semibold my-2 mt-3" {...props}>{children}</h2>
                                                        ),
                                                        h3: ({ node, children, ...props }) => (
                                                            <h3 className="text-sm sm:text-base font-semibold my-2 mt-2" {...props}>{children}</h3>
                                                        ),
                                                        p: ({ node, children, ...props }) => (
                                                            <p className="my-2" {...props}>{children}</p>
                                                        ),
                                                        blockquote: ({ node, children, ...props }) => (
                                                            <blockquote className="border-l-4 border-gray-400 dark:border-gray-600 pl-3 italic my-2 opacity-75" {...props}>
                                                                {children}
                                                            </blockquote>
                                                        ),
                                                    }}
                                                >
                                                    {msg.text}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Loading indicator */}
                            {loading && (
                                <div className="flex gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                                        AI
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-3xl px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={bottomRef}></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 sm:px-4 py-4 sm:py-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onInput={handleTextAreaInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter Your Message..."
                            className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 max-h-32 resize-none text-sm sm:text-base transition-shadow"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            className="w-12 h-12 rounded-r-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            title="Send message (Ctrl + Enter)"
                        >
                            <MdSend className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}