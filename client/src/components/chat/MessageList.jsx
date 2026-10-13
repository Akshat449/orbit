import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages = [], currentUser, loading = false }) => {
    const messagesEndRef = useRef(null);

    // Automatically scroll to the bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 1. Loading State
    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-text-muted">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-xs">Loading messages...</span>
            </div>
        );
    }

    // 2. Empty State
    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-text-muted select-none">
                <div className="w-12 h-12 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center mb-3 text-primary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                        />
                    </svg>
                </div>
                <p className="text-sm font-medium text-text-main">No messages yet</p>
                <p className="text-xs text-text-muted mt-1">
                    Be the first to say hello to the board!
                </p>
            </div>
        );
    }

    // 3. Normal Message Feed
    return (
        <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg, index) => (
                <MessageItem
                    key={msg._id || index}
                    message={msg}
                    currentUser={currentUser}
                />
            ))}
            {/* Invisible anchor element to auto-scroll into view */}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
