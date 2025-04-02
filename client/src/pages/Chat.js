import React, { useEffect, useState } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import { useAuth } from "../components/AuthContext";
import "../styles/Chat.css";

const Chat = () => {
  const { user } = useAuth();
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/messages/history", {
          email: user.email,
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const pusher = new Pusher("3eae2d73125b83698a00", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", (data) => {
      const { sender, receiver, message, timestamp } = data;
      if (sender === user.email || receiver === user.email) {
        setMessages((prevMessages) => [...prevMessages, { sender, receiver, message, timestamp }]);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [user]);

  const handleSend = async () => {
    if (!user || !recipient || !message) return;
    try {
      await axios.post("http://localhost:5000/api/messages", {
        sender: user.email,
        receiver: recipient,
        message,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <div className="chat-inputs">
        <input
          type="text"
          placeholder="Recipient email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>

      <h3>Chat Messages</h3>
      <ul className="chat-messages">
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`chat-bubble ${msg.sender === user.email ? "sent" : "received"}`}
          >
            <div className="chat-meta">
              <strong>{msg.sender}</strong>
              <span>{msg.timestamp ? formatTimestamp(msg.timestamp) : ""}</span>
            </div>
            <div>{msg.message}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
