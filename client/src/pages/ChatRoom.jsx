import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

const ChatRoom = ({ user }) => {
  const { socket, onlineUsers } = useSocket();
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); 
  const [privateMessages, setPrivateMessages] = useState({}); 
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("private_message", ({ from, message }) => {
  const otherUser = from === user.username ? selectedUser : from;

  setPrivateMessages((prev) => {
    const existing = prev[otherUser] || [];
    return {
      ...prev,
      [otherUser]: [...existing, { from, message }],
    };
  });
});

{selectedUser &&
  (privateMessages[selectedUser] || []).map((msg, i) => (
    <div
      key={i}
      className={`p-2 rounded ${
        msg.from === user.username ? "bg-blue-100 text-right" : "bg-green-100"
      }`}
    >
      <strong>{msg.from}: </strong> {msg.message}
    </div>
))}

    socket.on("user_typing", (username) => {
      if (username !== user.username) {
        setTypingUser(username);
        setTimeout(() => setTypingUser(null), 1500);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("private_message");
      socket.off("user_typing");
    };
  }, [socket, user.username]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (selectedUser) {
      socket.emit("private_message", {
        to: selectedUser,
        from: user.username,
        message,
      });

      setPrivateMessages((prev) => {
        const existing = prev[selectedUser] || [];
        return {
          ...prev,
          [selectedUser]: [...existing, { from: user.username, message }],
        };
      });
    } else {
      socket.emit("send_message", {
        sender: user.username,
        content: message,
      });
    }

    setMessage("");
  };

  const handleTyping = () => {
    if (socket && !selectedUser) {
      socket.emit("typing", user.username);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-600 text-white p-4 text-center font-semibold">
        Welcome, {user.username}
      </header>

      <div className="flex flex-1">
        {/* Sidebar: Online Users */}
        <aside className="w-1/4 bg-white border-r p-4 hidden sm:block">
          <h3 className="font-bold mb-2">Online Users</h3>
          <ul className="text-sm space-y-1">
            {onlineUsers.map((u, i) => (
              <li
                key={i}
                onClick={() => setSelectedUser(u !== user.username ? u : null)}
                className={`cursor-pointer p-1 rounded ${
                  selectedUser === u ? "bg-blue-100 font-bold" : ""
                } ${u === user.username ? "text-gray-400" : ""}`}
              >
                • {u}
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat Window */}
        <main className="flex-1 p-4 flex flex-col justify-between">
          <div className="space-y-2 mb-4 overflow-y-auto h-[60vh]">
            {/* Display private or global messages */}
            {selectedUser
              ? (privateMessages[selectedUser] || []).map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded ${
                      msg.from === user.username
                        ? "bg-blue-100 text-right"
                        : "bg-green-100"
                    }`}
                  >
                    <strong>{msg.from}: </strong> {msg.message}
                  </div>
                ))
              : messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded ${
                      msg.sender === user.username
                        ? "bg-blue-100 text-right"
                        : "bg-gray-200"
                    }`}
                  >
                    <strong>{msg.sender}: </strong> {msg.content}
                  </div>
                ))}

            {typingUser && !selectedUser && (
              <p className="text-sm text-gray-500">{typingUser} is typing...</p>
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleTyping}
              placeholder={
                selectedUser
                  ? `Private message to ${selectedUser}`
                  : "Type a message..."
              }
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Send
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ChatRoom;