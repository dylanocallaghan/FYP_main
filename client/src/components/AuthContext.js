import React, { createContext, useContext, useState, useEffect } from "react";
import { StreamChat } from "stream-chat";

const AuthContext = createContext();
const streamClient = StreamChat.getInstance("yduz4z95nncj");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [streamReady, setStreamReady] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      connectToStream(parsed);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("username", user.username);
      connectToStream(user);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      disconnectFromStream();
    }
  }, [user]);

  const connectToStream = async (u) => {
    if (!u?.username || streamClient.userID === u.username) return;

    try {
      const res = await fetch("http://localhost:5000/stream/getToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: u.username }),
      });

      const data = await res.json();
      if (!data.token) return;

      await streamClient.connectUser(
        { id: u.username, name: u.name || u.username },
        data.token
      );

      setStreamReady(true);
    } catch (err) {}
  };

  const disconnectFromStream = async () => {
    if (streamClient.userID) {
      await streamClient.disconnectUser();
      setStreamReady(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, streamClient, streamReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
