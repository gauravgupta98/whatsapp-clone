import React, { useEffect, useRef, useState } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
  Send,
} from "@material-ui/icons";
import { useParams } from "react-router-dom";
import firebase from "firebase";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";

import db from "../../firebase";
import "./Chat.css";
import { useStateValue } from "../StateProvider";

function Chat() {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  const emojiPickerRef = useRef(null);
  const messagesRef = useRef(null);

  // setup the room name and populate messages when Chat component is loaded.
  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  // generate random avatars for chat
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  // add event listeners when component is loaded
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    if (messagesRef) {
      messagesRef.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      hideEmojiPicker();
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (input.length === 0 || input.trim().length === 0) return;

    db.collection("rooms").doc(roomId).collection("messages").add({
      name: user.displayName,
      message: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };

  const startSpeechRecognition = (e) => {
    if (window.hasOwnProperty("webkitSpeechRecognition")) {
      // eslint-disable-next-line no-undef
      var recognition = new webkitSpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.lang = "en-US";
      recognition.start();
      recognition.onresult = function (e) {
        let cursorPosition = document.getElementById("chatInput")
          .selectionStart;
        setInput(
          `${input.slice(0, cursorPosition)}${
            e?.results[0][0]?.transcript
          }${input.slice(cursorPosition)}`
        );
        recognition.stop();
      };

      recognition.onerror = function (e) {
        recognition.stop();
      };
    }
  };

  const showEmojiPicker = () =>
    (document.getElementById("emojiPickerContainer").style.display = "block");

  const hideEmojiPicker = () =>
    (document.getElementById("emojiPickerContainer").style.display = "none");

  const onEmojiClick = (e, emojiObject) => {
    let cursorPosition = document.getElementById("chatInput").selectionStart;
    setInput(
      `${input.slice(0, cursorPosition)}${emojiObject.emoji}${input.slice(
        cursorPosition
      )}`
    );

    hideEmojiPicker();
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          {messages.length > 0 && (
            <p>
              Last seen{" "}
              {new Date(
                messages[messages.length - 1]?.timestamp?.toDate()
              ).toLocaleString()}
            </p>
          )}
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

      <div className="chat__body" ref={messagesRef}>
        {messages.map((message) => (
          <p
            className={`chat__message ${
              message.name === user.displayName && "chat__receiver"
            }`}
          >
            <span className="chat__name">{message.name}</span>
            <span className="chat__messageText">{message.message}</span>
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toLocaleTimeString()}
            </span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <div
          ref={emojiPickerRef}
          className="chat__emojiPicker"
          id="emojiPickerContainer"
          style={{ display: "none" }}
        >
          <Picker
            onEmojiClick={onEmojiClick}
            disableAutoFocus={true}
            skinTone={SKIN_TONE_MEDIUM_DARK}
            groupNames={{ smileys_people: "PEOPLE" }}
            native
          />
        </div>
        <IconButton onClick={showEmojiPicker}>
          <InsertEmoticon />
        </IconButton>
        <form>
          <input
            type="text"
            value={input}
            id="chatInput"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            <Send />
          </button>
        </form>
        <IconButton onClick={startSpeechRecognition}>
          <Mic />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
