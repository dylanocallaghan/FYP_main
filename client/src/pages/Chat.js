// Chat.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  Thread,
  Window,
  MessageList,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import "../styles/Chat.css";

const ChatPage = () => {
  const { user, streamClient, streamReady } = useAuth();
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const setupChannel = async () => {
      if (!user || !streamClient || !streamReady) return;

      const storedChannelId = localStorage.getItem("chatChannelId");
      if (storedChannelId) {
        try {
          const ch = streamClient.channel("messaging", storedChannelId);
          await ch.watch();
          setChannel(ch);
          console.log("✅ Channel ready:", ch.id);
        } catch (err) {
          console.error("❌ Failed to watch channel:", err);
        }
      } else {
        console.log("⚠️ No channel ID found in localStorage.");
      }
    };

    setupChannel();
  }, [user, streamClient, streamReady]);

  if (!channel) {
    return <div style={{ padding: "2rem", fontSize: "18px" }}>Loading chat...</div>;
  }

  return (
    <Chat client={streamClient} theme="messaging light">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default ChatPage;
