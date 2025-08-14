import React, { useEffect, useState } from "react";
import { socket } from "./ChatApp.jsx";

export default function MessageList({
  messages,
  username,
  messagesEndRef,
  typingUser,
}) {
  const [showWelcome, setShowWelcome] = useState(""); // show welcome only once

  useEffect(() => {
    const handleWelcome = (data) => {
      setShowWelcome(data.message);

      // clear welcome message after 9s
      const timer = setTimeout(() => setShowWelcome(""), 9000);

      // cleanup previous timer if any
      return () => clearTimeout(timer);
    };

    socket.on("welcome_msg", handleWelcome);

    return () => {
      socket.off("welcome_msg", handleWelcome);
    };
  }, []);

  const getAvatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`;

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className="flex-grow-1 overflow-auto mb-2 p-3 border rounded"
      style={{ backgroundColor: "#eef6ffff", height: "90vh" }}
    >
      {/* Header */}
      <div
        className="p-2 border-bottom mb-3 d-flex justify-content-between align-items-center"
        style={{
          fontWeight: "bold",
          position: "sticky",
          top: 0,
          backgroundColor: "#eef6ff",
          zIndex: 10,
        }}
      >
        <div>Chat Room</div>

        {/* Right side welcome message, only first time */}
        {showWelcome && (
          <div style={{ fontWeight: "normal", fontSize: "0.9rem" }}>
            {showWelcome}
          </div>
        )}
      </div>

      {/* Typing indicator below header */}
      {typingUser && (
        <div
          style={{
            fontWeight: "normal",
            fontSize: "0.9rem",
            marginBottom: "8px",
            color: "#282727ff",
          }}
        >
          {typingUser}
        </div>
      )}

      {/* Messages */}
      {messages.map((msg, index) => {
        const isOwnMessage = msg.username === username;

        return (
          <div
            key={index}
            className={`d-flex mb-2 ${
              isOwnMessage ? "justify-content-end" : "justify-content-start"
            }`}
          >
            {!isOwnMessage && (
              <img
                src={getAvatarUrl(msg.username)}
                alt={msg.username}
                className="rounded-circle me-2"
                style={{ width: "40px", height: "40px" }}
              />
            )}

            <div
              className={`p-2 rounded ${
                isOwnMessage ? "bg-info text-white" : "bg-light"
              }`}
              style={{ maxWidth: "75%" }}
            >
              {isOwnMessage ? (
                <div className="d-flex justify-content-between align-items-center">
                  <span>{msg.message}</span>
                  <small
                    className="text-muted"
                    style={{
                      fontSize: "0.7rem",
                      opacity: 0.7,
                      marginLeft: "8px",
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </small>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{msg.username}</strong>
                    <small
                      className="text-muted"
                      style={{
                        fontSize: "0.7rem",
                        opacity: 0.7,
                        marginLeft: "8px",
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </small>
                  </div>
                  <div style={{ marginTop: "4px" }}>{msg.message}</div>
                </>
              )}
            </div>

            {isOwnMessage && (
              <img
                src={getAvatarUrl(msg.username)}
                alt={msg.username}
                className="rounded-circle ms-2"
                style={{ width: "40px", height: "40px" }}
              />
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
