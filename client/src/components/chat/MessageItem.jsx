import React from "react";

const MessageItem = ({ message, currentUser }) => {
  // 1. Identify if the current logged-in user sent this message
  const senderId = message.sender?._id || message.sender;
  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwn = currentUserId && senderId && currentUserId.toString() === senderId.toString();

  // 2. Format sender display name & initial
  const senderName = message.sender?.name || "Teammate";
  const initial = senderName.charAt(0).toUpperCase();

  // 3. Format timestamp to e.g. "03:15 PM"
  const formattedTime = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className={`flex flex-col mb-3.5 ${isOwn ? "items-end" : "items-start"}`}>
      {/* Sender name for teammate messages */}
      {!isOwn && (
        <div className="flex items-center gap-1.5 mb-1 px-1">
          <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-[9px] flex items-center justify-center">
            {initial}
          </div>
          <span className="text-[11px] font-semibold text-[#8c95a8]">
            {senderName}
          </span>
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[78%] px-4 py-2.5 rounded-2xl text-xs break-words leading-relaxed shadow-sm ${
          isOwn
            ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-tr-xs shadow-indigo-500/10"
            : "bg-[#151926] border border-[#22283b] text-white/95 rounded-tl-xs"
        }`}
      >
        {/* Message Content */}
        <p className="whitespace-pre-wrap">{message.content}</p>

        {/* Timestamp */}
        <div
          className={`text-[9px] mt-1 text-right select-none ${
            isOwn ? "text-indigo-200/80" : "text-[#8c95a8]"
          }`}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
