import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";

const ChatRoom = ({ username }) => {
  const { socket, onlineUsers } = useSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("global");
  const [file, setFile] = useState(null);

  const messagesEndRef = useRef();

  // 🔽 Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔁 Join a room on mount or room change
  useEffect(() => {
    if (socket && username) {
      console.log(`📡 Emitting join_room to "${room}"`);
      socket.emit("join_room", room);
    }
  }, [socket, room, username]); // ✅ include username to avoid React warning

  // 🔔 Listen for messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      console.log("📥 Received:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive_message", handleMessage);
    socket.on("private_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("private_message", handleMessage);
    };
  }, [socket]);

  // ✅ Send a message
  const handleSend = async () => {
    if (!message.trim() && !file) return;

    let fileUrl = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:4000/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        fileUrl = data.filePath;
      } catch (err) {
        console.error("❌ File upload failed", err);
      }
    }

    const msgData = {
      sender: username,
      content: message.trim(),
      room,
      fileUrl,
      timestamp: new Date().toISOString(),
    };

    console.log("📤 Sending message:", msgData);
    socket.emit("send_message", msgData);

    setMessage("");
    setFile(null);
  };

  // 🕒 Format timestamp
  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 🔁 Switch room
  const switchRoom = (newRoom) => {
    console.log("🔁 Switching to room:", newRoom);
    setMessages([]);
    setRoom(newRoom);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-lg space-y-4">
      <h2 className="text-xl font-bold">💬 VibeChat - {room}</h2>

      {/* Room Buttons */}
      <div className="flex gap-4 mb-2">
        <button onClick={() => switchRoom("global")} className="text-blue-600">🌍 Global</button>
        <button onClick={() => switchRoom("tech")} className="text-green-600">💻 Tech</button>
        <button onClick={() => switchRoom("fun")} className="text-pink-600">🎉 Fun</button>
      </div>

      {/* Online Users */}
      <div className="text-sm">
        <strong>🟢 Online:</strong>{" "}
        {onlineUsers.map((user) => (
          <span key={user} className="mr-2">{user}</span>
        ))}
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto bg-gray-100 border p-4 rounded">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <strong>{msg.sender}:</strong>{" "}
            {msg.content && <span>{msg.content}</span>}
            {msg.fileUrl && (
              <a
                href={`http://localhost:4000${msg.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 underline"
              >
                📎 File
              </a>
            )}
            {msg.timestamp && (
              <span className="text-xs text-gray-500 ml-2">
                [{formatTime(msg.timestamp)}]
              </span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="flex gap-2 mt-4 items-center">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm"
        />
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
          placeholder={`Message to ${room}`}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
