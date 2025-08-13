import React, { useState } from "react";

export default function Onboarding({ onJoin }) {
  const [name, setName] = useState("");

  const handleJoin = () => {
    if (name.trim()) {
      onJoin(name.trim());
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #eef6ff, #dbeafe)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 className="text-center mb-3">💬 Welcome to the Chat App!</h2>
        <p className="text-muted text-center">
          To get started, please enter your username:
        </p>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter your username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
        />
        <button
          className="btn btn-primary w-100"
          onClick={handleJoin}
          disabled={!name.trim()}
        >
          Join Chat
        </button>
      </div>
    </div>
  );
}
