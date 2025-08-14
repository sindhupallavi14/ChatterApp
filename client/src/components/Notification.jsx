import React, { useEffect } from "react";

export default function Notification({ message, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(); // Remove notification after 5s
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!message) return null;

  return (
    <div
      className="alert alert-info text-center"
      style={{
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "auto",
        minWidth: "200px",
      }}
    >
      {message}
    </div>
  );
}
