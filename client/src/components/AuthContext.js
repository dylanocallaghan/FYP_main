import React, { createContext, useContext, useState, useEffect } from "react";
import { StreamChat } from "stream-chat";

const AuthContext = createContext();
const streamClient = StreamChat.getInstance("yduz4z95nncj"); // Your app key

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [streamReady, setStreamReady] = useState(false);

  // On initial load, restore session
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      connectToStream(parsedUser);
    }
  }, []);

  // On user state change, sync to localStorage and Stream
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("username", user.username);
      connectToStream(user);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("token");
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
      if (!data.token) throw new Error("No token returned from /getToken");

      await streamClient.connectUser(
        {
          id: u.username,
          name: u.name || u.username,
          accountType: u.accountType,
        },
        data.token
      );

      setStreamReady(true);
    } catch (error) {
      console.error("❌ Error connecting to Stream:", error);
    }
  };

  const disconnectFromStream = async () => {
    if (streamClient.userID) {
      await streamClient.disconnectUser();
      setStreamReady(false);
    }
  };

  const loginUser = async (token, userData) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("username", userData.username);
      setUser(userData);
    } catch (error) {
      console.error("Error inside loginUser:", error);
      throw error;
    }
  };
  
  

  const logoutUser = async () => {
    await disconnectFromStream();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    setUser(null);
    window.location.href = "/login"; // ✅ Redirect to login cleanly
  };

  return (
    <AuthContext.Provider value={{ user, setUser, streamClient, streamReady, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
