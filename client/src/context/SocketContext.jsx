
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Set this to match your backend
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
