"use client";
import { MdSend } from "react-icons/md";
import VoiceInputButton from "@/components/chat/VoiceInputButton";

export default function ChatInput({ input, setInput, sendMessage, loading, handleKeyDown }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-40 px-6 py-3">
            <div className="flex gap-1 items-end">
                {/* input box */}
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className="flex-1 p-3 rounded-r-sm rounded-l-3xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none"
                    placeholder="Type your message..."
                />

                {/* voice inp call with transcript from mic */}
                <VoiceInputButton onTranscript={(text) => setInput(text)} />

                <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    className="shrink-0 w-10 h-12 bg-blue-600 text-white rounded-l-sm rounded-r-3xl flex items-center justify-center disabled:opacity-50 hover:bg-blue-700"
                >
                    <MdSend className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
