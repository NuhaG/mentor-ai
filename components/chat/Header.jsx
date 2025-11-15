"use client";
import { MdArrowBack, MdMenu } from "react-icons/md";
import Link from "next/link";

export default function Header({ persona, toggleSidebar }) {
    return (
        <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-40 flex items-center px-6 py-2 justify-between">
            {/* left avatar det */}
            <div className="flex items-center gap-3">
                {/* link to home */}
                <Link href="/" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <MdArrowBack className="w-6 h-6" />
                </Link>

                {/* avatar */}
                <img
                    src={
                        persona?.avatar ||
                        'https://api.dicebear.com/9.x/bottts/svg?seed=Default&backgroundColor=b6e3f4'
                    }
                    className="w-10 h-10 rounded-full ring-1 ring-gray-100 dark:ring-gray-800 object-cover"
                />

                <div className="min-w-0">
                    <div className="text-lg font-semibold">
                        {persona?.name || 'AI Chat'}
                    </div>
                    {persona && (
                        <div className="text-xs text-gray-500">
                            {persona.description}
                        </div>
                    )}
                </div>
            </div>

            {/* right sidebar */}
            <button
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <MdMenu className="w-6 h-6" />
            </button>
        </div>
    );
}
