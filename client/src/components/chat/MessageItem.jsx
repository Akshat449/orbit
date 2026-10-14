import React from "react";

const MessageItem = ({ message, currentUser }) => {
  // 1. Identify if the current logged-in user sent this message
  const senderId = message.sender?._id || message.sender;
  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwn = currentUserId && senderId && currentUserId.toString() === senderId.toString();

  // 2. Format sender display name
  const senderName = message.sender?.name || "Teammate";

  // 3. Format timestamp to e.g. "03:15 PM"
  const formattedTime = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className={`flex flex-col mb-3 ${isOwn ? "items-end" : "items-start"}`}>
      {/* Sender name: only show for messages sent by others */}
      {!isOwn && (
        <span className="text-xs font-medium text-text-muted mb-1 px-1">
          {senderName}
        </span>
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[80%] sm:max-w-[70%] px-3.5 py-2 rounded-2xl text-sm shadow-sm break-words ${
          isOwn
            ? "bg-primary text-white rounded-br-xs"
            : "bg-dark-surface border border-dark-border text-text-main rounded-bl-xs"
        }`}
      >
        {/* Message Content */}
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

        {/* Timestamp */}
        <div
          className={`text-[10px] mt-1 text-right select-none ${
            isOwn ? "text-indigo-200/80" : "text-text-muted"
          }`}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
