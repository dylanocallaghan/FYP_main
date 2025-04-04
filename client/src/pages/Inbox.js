import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  MessageList,
  MessageInput,
  ChannelHeader,
  Thread,
  Avatar,
  useChannelStateContext,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import "../styles/inbox.css";

const CustomChannelHeader = () => {
  const { channel } = useChannelStateContext();
  const members = Object.values(channel.state.members);
  const otherUser = members.find(
    (m) => m.user.id !== channel.getClient().userID
  )?.user;

  return (
    <div className="custom-header">
      <Avatar name={otherUser?.name} size={36} />
      <div className="header-info">
        <div className="header-name">{otherUser?.name}</div>
        <div className="header-status">
          {otherUser?.accountType
            ? otherUser.accountType === "student"
              ? "Student"
              : "Listing Owner"
            : ""}
        </div>
      </div>
    </div>
  );
};

const Inbox = () => {
  const { streamClient, user, streamReady } = useAuth();
  const [channels, setChannels] = useState([]);
  const [pinned, setPinned] = useState({});
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const filters = { type: "messaging", members: { $in: [user?.username] } };
  const sort = { last_message_at: -1 };

  if (!streamClient || !streamReady) {
    return <div className="inbox-loading">Loading inbox...</div>;
  }

  const handleDeleteChannel = async (channel) => {
    try {
      await channel.delete();
      setChannels((prev) => prev.filter((c) => c.id !== channel.id));
    } catch (err) {
      console.error("Failed to delete channel:", err);
    }
  };

  const handlePinChannel = (channel) => {
    setPinned((prev) => ({
      ...prev,
      [channel.id]: !prev[channel.id],
    }));
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="inbox-wrapper">
      <Chat client={streamClient} theme="messaging light">
        <div className="inbox-container">
          <div className="inbox-sidebar">
            <ChannelList
              filters={filters}
              sort={sort}
              onChannels={(loaded) =>
                setChannels(
                  loaded.sort((a, b) => {
                    const aPinned = pinned[a.id] ? -1 : 1;
                    const bPinned = pinned[b.id] ? -1 : 1;
                    return aPinned - bPinned;
                  })
                )
              }
              Preview={(props) => {
                const { channel, setActiveChannel, activeChannel } = props;
                const lastMessage = channel.state.messages?.slice(-1)[0];
                const lastTimestamp = lastMessage?.created_at;
                const formattedTime = formatTime(lastTimestamp);
                const unreadCount = channel.countUnread();
                const other = Object.values(channel.state.members || {}).find(
                  (m) => m.user?.id !== user?.username
                );

                return (
                  <div
                    onClick={() => setActiveChannel(channel)}
                    className={`inbox-sidebar-item ${
                      channel.id === activeChannel?.id ? "active" : ""
                    }`}
                  >
                    <div className="inbox-user-info">
                      <div className="user-line">
                        <Avatar name={other?.user?.name} size={32} />
                        <div className="user-meta">
                          <div className="meta-header">
                            <strong>{other?.user?.name || "Unknown"}</strong>
                            <span className="message-time">{formattedTime}</span>
                          </div>
                          <div className="last-message">
                            {lastMessage?.text?.slice(0, 35) || "No messages yet"}
                          </div>
                        </div>
                      </div>

                      {unreadCount > 0 && (
                        <div className="unread-badge">{unreadCount}</div>
                      )}

                      <div className="dropdown-container" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="menu-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === channel.id ? null : channel.id);
                          }}
                        >
                          ⋮
                        </button>
                        <div
                          className={`dropdown-menu ${
                            openDropdownId === channel.id ? "show" : ""
                          }`}
                        >
                          <button onClick={() => handlePinChannel(channel)}>
                            {pinned[channel.id] ? "Unpin Chat" : "Pin Chat"}
                          </button>
                          <button onClick={() => handleDeleteChannel(channel)}>
                            Delete Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </div>
          <div className="inbox-chat-area">
            <Channel>
              <Window>
                <CustomChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </div>
        </div>
      </Chat>
    </div>
  );
};

export default Inbox;
