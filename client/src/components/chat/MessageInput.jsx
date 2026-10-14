import React, { useState } from "react";

const MessageInput = ({ onSendMessage, disabled = false }) => {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmed = text.trim();
        if (!trimmed || disabled) return;

        onSendMessage(trimmed);
        setText("");
    };

    const isSendDisabled = disabled || !text.trim();

    return (
        <form
            onSubmit={handleSubmit}
            className="p-3.5 border-t border-[#22283b] bg-[#151926] flex items-center gap-2"
        >
            {/* Text Input */}
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={disabled ? "Connecting to live chat..." : "Type a message to the board..."}
                disabled={disabled}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-[#090a10] border border-[#22283b] text-white placeholder-[#8c95a8]/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 disabled:opacity-50"
            />

            {/* Send Button */}
            <button
                type="submit"
                disabled={isSendDisabled}
                title="Send message"
                className={`p-2.5 rounded-xl font-medium text-white transition-all duration-200 flex items-center justify-center ${
                    isSendDisabled
                        ? "bg-[#22283b] text-[#8c95a8] opacity-40 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 active:scale-95 cursor-pointer shadow-md shadow-indigo-500/20"
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                >
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
            </button>
        </form>
    );
};

export default MessageInput;
