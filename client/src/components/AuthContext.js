import React, { createContext, useContext, useState, useEffect } from "react";
import { StreamChat } from "stream-chat";

// Create golbal context to store auth states and functions
const AuthContext = createContext();
const streamClient = StreamChat.getInstance("yduz4z95nncj"); // App key

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [streamReady, setStreamReady] = useState(false);

  // Load user session from localStorage on initial app load
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

  // Establish a secure connection to Stream Chat for the logged-in user
  const connectToStream = async (u) => {
    if (!u?.username || streamClient.userID === u.username) return;

    try {
      const res = await fetch("http://localhost:5000/api/stream/getToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` // ✅ Secure it
        },
        body: JSON.stringify({ id: u.username }), // ✅ Match backend
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

// Disconnect user from Stream Chat and cleanup state
  const disconnectFromStream = async () => {
    if (streamClient.userID) {
      await streamClient.disconnectUser();
      setStreamReady(false);
    }
  };

  // Login handler: Save token, store user data in localStorage, and update context
  const loginUser = async (token, userData) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("username", userData.username);

      // ✅ Ensure groupId is stored if present
      const userWithGroup = {
        ...userData,
        groupId: userData.groupId || null,
      };
      localStorage.setItem("user", JSON.stringify(userWithGroup));

      setUser(userWithGroup);
    } catch (error) {
      console.error("Error inside loginUser:", error);
      throw error;
    }
  };

  // Logout handler: clear session, disconnect Stream, and redirect to login page
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
