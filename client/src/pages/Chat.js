import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
  ChannelList,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

const ChatPage = () => {
  const { user, streamClient, streamReady } = useAuth();
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const setupChannel = async () => {
      const channelId = localStorage.getItem("activeChannelId");
      if (!streamReady || !user?.username || !channelId) return;

      try {
        const ch = streamClient.channel("messaging", channelId);
        await ch.watch();
        setChannel(ch);
      } catch (err) {
        console.error("Channel setup failed:", err);
      }
    };

    setupChannel();
  }, [streamReady, user]);

  if (!streamReady || !channel) return <div>Loading chat...</div>;

  const filters = { type: "messaging", members: { $in: [user.username] } };
  const sort = { last_message_at: -1 };

  return (
    <Chat client={streamClient} theme="messaging light">
      <ChannelList filters={filters} sort={sort} />
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
