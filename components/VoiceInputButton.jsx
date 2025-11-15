"use client";
import { useState, useRef } from "react";
import { MdMic, MdMicOff } from "react-icons/md";

export default function VoiceInputButton({ onTranscript }) {

    const [isRec, setIsRec] = useState(false);
    const recognitionRef = useRef(null);

    const start = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Your browser does not support speech recognition!");
            return;
        }

        const recog = new window.webkitSpeechRecognition();
        recog.lang = "en-UK"
        recog.continuous = false;

        recog.onstart = () => setIsRec(true);
        recog.onend = () => setIsRec(false);

        recog.onresult = (e) => {
            const text = e.results[0][0].transcript;
            onTranscript(text);
        }

        recognitionRef.current = recog;
        recog.start();
    }
    const stop = () => recognitionRef.current?.stop();

    return (
        <button
            onClick={isRec ? stop : start}
            className={`w-10 h-12 rounded-sm border-gray-300 flex items-center justify-center text-white transition-colors ${isRec ? "bg-red-600" : "bg-blue-700 hover:bg-blue-800"
                }`}
            title={isRec ? "Stop Recording" : "Start Recording"}
        >
            {isRec ? <MdMic /> : <MdMicOff />}
        </button>
    );
}
