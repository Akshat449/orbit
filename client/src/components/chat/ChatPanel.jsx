import React from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatPanel = ({
  isOpen,
  onClose,
  messages = [],
  currentUser,
  onSendMessage,
  loading = false,
  disabled = false,
  boardTitle = "Board Chat",
}) => {
  // If not open, render nothing to keep DOM clean
  if (!isOpen) return null;

  return (
    <>
      {/* 1. Backdrop overlay for mobile screens */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 sm:hidden transition-opacity"
      />

      {/* 2. Chat Sidebar Drawer */}
      <aside className="fixed top-0 right-0 h-screen w-full sm:w-96 bg-[#10131d] border-l border-[#22283b] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-[#22283b] bg-[#151926] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.177 7.152.521 1.942.285 3.348 1.986 3.348 3.951v7.556c0 1.965-1.406 3.666-3.348 3.951a49.206 49.206 0 0 1-3.693.425 4.793 4.793 0 0 0-2.88 1.135l-2.023 1.706a.75.75 0 0 1-1.233-.574V18.75A49.043 49.043 0 0 1 4.848 18.28C2.906 17.994 1.5 16.293 1.5 14.328V6.722c0-1.965 1.406-3.666 3.348-3.951ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 3a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Board Chat</h2>
                {disabled ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Connecting
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8c95a8] truncate max-w-[180px] mt-0.5">
                {boardTitle}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            title="Close chat"
            className="p-1.5 rounded-xl text-[#8c95a8] hover:text-white hover:bg-[#10131d] border border-transparent hover:border-[#22283b] transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message Feed Body */}
        <MessageList
          messages={messages}
          currentUser={currentUser}
          loading={loading}
        />

        {/* Bottom Input Footer */}
        <MessageInput
          onSendMessage={onSendMessage}
          disabled={disabled}
        />
      </aside>
    </>
  );
};

export default ChatPanel;
