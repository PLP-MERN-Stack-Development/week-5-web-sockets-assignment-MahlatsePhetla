
import { useState } from "react";
import LoginPage from "./LoginPage";
import ChatRoom from "./ChatRoom";
a
const MainPage = () => {
  const [username, setUsername] = useState("");

  return (
    <>
      {!username ? (
        <LoginPage setUsername={setUsername} />
      ) : (
        <ChatRoom username={username} />
      )}
    </>
  );
};

export default MainPage;
