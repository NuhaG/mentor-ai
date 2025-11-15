"use client";
import { MdClose, MdDelete } from "react-icons/md";

export default function Sidebar({ sidebarOpen, sessions, loadSession, close, deleteSession, newSession }) {
    return (
        <div
            className={`fixed top-0 bottom-0 right-0 w-64 bg-gray-100 dark:bg-gray-900 
            border-l border-gray-200 dark:border-gray-800 z-50 transform 
            transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-xl font-bold">Sessions</h3>
                <button onClick={close} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                    <MdClose className="w-5 h-5" />
                </button>
            </div>

            {/* List Sess */}
            <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-5rem)]">
                {sessions.length === 0 ? (
                    <p className="text-sm text-gray-500">No sessions yet</p>
                ) : (
                    sessions.map((s, index) => (
                        <div key={`${s._id}-${index}`} className="flex justify-between items-center bg-blue-950 p-4 rounded-sm">
                            <button onClick={() => loadSession(s)} className="w-full text-left">
                                <div className="text-sm font-medium truncate">{s.personaName}</div>
                                <div className="text-xs text-gray-500 truncate">{new Date(s.createdAt).toLocaleDateString()}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">{s.conversation?.length || 0} messages</div>
                            </button>
                            <button
                                onClick={() => deleteSession(s._id)}
                                className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-800"
                                title="Delete Session"
                            >
                                <MdDelete className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <button onClick={newSession} className="fixed bottom-0 w-full p-3 bg-blue-800 text-white rounded hover:bg-blue-700 font-semibold" >
                New Chat
            </button>
        </div>
    );
}
