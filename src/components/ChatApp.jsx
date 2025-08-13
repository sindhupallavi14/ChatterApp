import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";
import UserList from "./UserList.jsx";
import Notification from "./Notification.jsx";
import Onboarding from "./Onboarding.jsx";

export const socket = io("http://localhost:5000");

export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!username) return;

    socket.emit("join", username);

    socket.on("previous_messages", (msgs) => {
      setMessages(
        msgs.map((m) => ({
          username: m.username ?? m.user ?? "Anonymous",
          message: m.message ?? m.text ?? "",
          timestamp: m.timestamp ?? m.createdAt ?? m.time ?? Date.now(),
        }))
      );
    });

    socket.on("broadcast_message", (m) => {
      setMessages((prev) => [...prev, m]);
    });

    socket.on("user_joined", ({ username }) => {
      setNotification(`${username} has joined the chat`);
    });

    socket.on("user_disconnected", ({ username }) => {
      setNotification(`${username} has left the chat`);
    });

    socket.on("user_list", (userList) => {
      setUsers(userList);
    });

    socket.on("user_typing", ({ username }) => {
      setTypingUser(`${username} is typing...`);
    });
    socket.on("user_stopped_typing", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("previous_messages");
      socket.off("broadcast_message");
      socket.off("user_list");
      socket.off("user_joined");
      socket.off("user_disconnected");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, [username]);

  const sendMessage = () => {
    if (message.trim()) {
      const ts = Date.now();
      socket.emit("new_message", { message, timestamp: ts });
      setMessages((prev) => [...prev, { username, message, timestamp: ts }]);
      setMessage("");
    }
  };

  if (!username) {
    return <Onboarding onJoin={(name) => setUsername(name)} />;
  }

  return (
    <div className="container-fluid py-3" style={{ height: "100vh" }}>
      <Notification
        message={notification}
        onDismiss={() => setNotification("")}
      />
      <div className="row h-100">
        {/* Left side: Messages + Input */}
        <div className="col-12 col-md-8 d-flex flex-column">
          <MessageList
            messages={messages}
            username={username}
            messagesEndRef={messagesEndRef}
            typingUser={typingUser}
          />
          <MessageInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>

        {/* Right side: Users */}
        <div className="col-12 col-md-4 mt-3 mt-md-0">
          <UserList users={users} />
        </div>
      </div>
    </div>
  );
}
