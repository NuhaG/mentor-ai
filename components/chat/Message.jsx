"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { MdVolumeMute, MdVolumeUp } from "react-icons/md";

export default function Message({ m, persona }) {
    const isUser = m.role === "user";
    const [speaking, setSpeaking] = useState(false);

    const handleSpeaking = (text) => {
        if (!window.speechSynthesis) return;

        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }

        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "en-UK";
        utter.onend = () => setSpeaking(false);

        window.speechSynthesis.speak(utter);
        setSpeaking(true);
    }

    // ai mess
    if (!isUser) {
        return (
            <div className="flex items-start gap-3 justify-start">
                {/* avatar */}
                <img
                    src={persona?.avatar || 'https://api.dicebear.com/9.x/bottts/svg?seed=AI&backgroundColor=b6e3f4'}
                    className="w-8 h-8 rounded-full ring-1 ring-gray-100 dark:ring-gray-800 object-cover mt-1"
                />
                {/* formatted res */}
                {/* needs some more formatting to support all types of res */}
                <div>
                    <div className="inline-block max-w-[75%] p-3 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                    {/* TTS Button */}
                    <button onClick={() => handleSpeaking(m.text)} className="flex items-center gap-1 text-sm mt-2 opacity-70 hover:opacity-100" >
                        {speaking ? <MdVolumeMute /> : <MdVolumeUp />}
                        {speaking ? "Stop" : "Speak"}
                    </button>
                </div>
            </div>
        );
    }

    // user mess
    return (
        <div className="flex items-end gap-3 justify-end">
            {/* mess */}
            <div className="inline-block max-w-[75%] p-3 rounded-lg whitespace-pre-wrap shadow-sm bg-linear-to-br from-blue-600 to-purple-600 text-white">
                {m.text}
            </div>
            {/* avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold mt-1">
                You
            </div>
        </div>
    );
}
