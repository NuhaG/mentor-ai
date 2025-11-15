"use client";
import { useState, useRef } from "react";
import { MdMic, MdMicOff } from "react-icons/md";

export default function VoiceInputButton({ onTranscript }) {
    const [isRec, setIsRec] = useState(false);
    const recognitionRef = useRef(null);

    // start speech rec instance
    const start = () => {
        // check if webkit supp
        if (!("webkitSpeechRecognition" in window)) {
            alert("Your browser does not support speech recognition!");
            return;
        }

        // create instance
        const recog = new window.webkitSpeechRecognition();
        recog.lang = "en-UK";
        recog.continuous = false; // auto stop after one sent

        recog.onstart = () => setIsRec(true);
        recog.onend = () => setIsRec(false);

        recog.onresult = (e) => {
            // first res of transcript
            const text = e.results[0][0].transcript;
            onTranscript(text); // send transcript back for input
        }

        recognitionRef.current = recog; // save curr instance
        recog.start();
    }

    const stop = () => recognitionRef.current?.stop();

    return (
        <button
            onClick={isRec ? stop : start}
            className={`w-10 h-12 rounded-sm border-gray-300 flex items-center justify-center text-white transition-colors ${isRec ? "bg-red-600" : "bg-blue-700 hover:bg-blue-800"}`}
            title={isRec ? "Stop Recording" : "Start Recording"}
        >
            {isRec ? <MdMic /> : <MdMicOff />}
        </button>
    );
}
