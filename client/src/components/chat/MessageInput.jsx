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
            className="p-3 border-t border-dark-border bg-dark-surface flex items-center gap-2"
        >
            {/* Text Input */}
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={disabled ? "Connecting to chat..." : "Type a message..."}
                disabled={disabled}
                className="flex-1 px-4 py-2 text-sm rounded-lg bg-dark-bg border border-dark-border text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
            />

            {/* Send Button */}
            <button
                type="submit"
                disabled={isSendDisabled}
                title="Send message"
                className={`p-2.5 rounded-lg font-medium text-white transition-all flex items-center justify-center ${isSendDisabled
                        ? "bg-dark-border text-text-muted opacity-50 cursor-not-allowed"
                        : "bg-primary hover:bg-primary-hover active:scale-95 cursor-pointer shadow-sm"
                    }`}
            >
                {/* Send Paper Plane Icon */}
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
