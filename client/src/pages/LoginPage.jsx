
import React, { useState } from "react";

const LoginPage = ({ setUsername }) => {
  const [input, setInput] = useState("");

  const handleLogin = () => {
    if (input.trim()) {
      setUsername(input.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 w-full mb-3"
        placeholder="Enter username"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Join Chat
      </button>
    </div>
  );
};

export default LoginPage;