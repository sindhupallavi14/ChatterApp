import { useRef } from "react";
import { socket } from "./ChatApp";


export default function MessageInput({ message, setMessage, sendMessage }) {
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setMessage(e.target.value);

    socket.emit("typing");

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing");
    }, 1000); // stop after 1s of no typing
  };

  const handleSend = () => {
    socket.emit("stop_typing"); // stop typing immediately when message sent
    sendMessage();
  };

  return (
    <div className="d-flex">
      <input
        type="text"
        className="form-control me-2"
        placeholder="Type your message"
        value={message}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button className="btn btn-outline-success" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}
