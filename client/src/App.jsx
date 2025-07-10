
// src/App.jsx
import { useState } from "react";
import { SocketProvider } from "./context/SocketContext";
import LoginPage from "./pages/LoginPage";
import ChatRoom from "./pages/ChatRoom";

function App() {
  const [username, setUsername] = useState(""); 

  return (
    <SocketProvider username={username}>
      {!username ? (
        <LoginPage setUsername={setUsername} />
      ) : (
        <ChatRoom username={username} />
      )}
    </SocketProvider>
  );
}

export default App;
