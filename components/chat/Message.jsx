"use client";
import React from "react";
import ReactMarkdown from "react-markdown";

export default function Message({ m, persona }) {
    const isUser = m.role === "user";

    if (!isUser) {
        return (
            <div className="flex items-start gap-3 justify-start">
                <img
                    src={persona?.avatar || 'https://api.dicebear.com/9.x/bottts/svg?seed=AI&backgroundColor=b6e3f4'}
                    className="w-8 h-8 rounded-full ring-1 ring-gray-100 dark:ring-gray-800 object-cover mt-1"
                />
                <div className="inline-block max-w-[75%] p-3 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-end gap-3 justify-end">
            <div className="inline-block max-w-[75%] p-3 rounded-lg whitespace-pre-wrap shadow-sm bg-linear-to-br from-blue-600 to-purple-600 text-white">
                {m.text}
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold mt-1">
                You
            </div>
        </div>
    );
}
