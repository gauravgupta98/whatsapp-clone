import React, { useEffect, useState } from "react";
import { Avatar, IconButton } from "@material-ui/core";

import "./Chat.css";
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
  Send,
} from "@material-ui/icons";

function Chat() {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>Room Name</h3>
          <p>Last seen at...</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        <p className={`chat__message ${true && "chat__receiver"}`}>
          <span className="chat__name">Gaurav Gupta</span>
          Hey guys
          <span className="chat__timestamp">4:33pm</span>
        </p>
      </div>

      <div className="chat__footer">
        <InsertEmoticon />
        <form>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            <Send />
          </button>
        </form>
        <Mic />
      </div>
    </div>
  );
}

export default Chat;
