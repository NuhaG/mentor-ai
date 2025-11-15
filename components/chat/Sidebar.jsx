"use client";
import { MdClose } from "react-icons/md";

export default function Sidebar({ sidebarOpen, sessions, loadSession, close }) {
    return (
        <div
            className={`fixed top-0 bottom-0 right-0 w-64 bg-gray-100 dark:bg-gray-900 
            border-l border-gray-200 dark:border-gray-800 z-50 transform 
            transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Sessions</h3>
                <button onClick={close} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                    <MdClose className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-5rem)]">
                {sessions.length === 0 ? (
                    <p className="text-sm text-gray-500">No sessions yet</p>
                ) : (
                    sessions.map((s) => (
                        <button
                            key={s._id}
                            onClick={() => loadSession(s)}
                            className="w-full text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <div className="text-sm font-medium truncate">{s.personaName}</div>
                            <div className="text-xs text-gray-500 truncate">
                                {new Date(s.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                {s.conversation?.length || 0} messages
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
