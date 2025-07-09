
import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import LoginPage from "./LoginPage";
import ChatRoom from "./ChatRoom";

const MainPage = () => {
  const [user, setUser] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket && user) {
      socket.emit("user_connected", user.username);
    }
  }, [socket, user]);

  return user ? (
    <ChatRoom user={user} />
  ) : (
    <LoginPage onLogin={setUser} />
  );
};

export default MainPage;