/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import Modal from "react-modal";

import db from "../../firebase";
import "./SidebarChat.css";
import { customStyles } from "../CustomModalStyles";

function SidebarChat({ id, name, addNewChat }) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const createChat = (e) => {
    e.preventDefault();

    if (roomName && roomName !== "") {
      db.collection("rooms").add({
        name: roomName,
      });
      setRoomName("");
      setModalIsOpen(false);
    }
  };

  return addNewChat ? (
    <div className="newChat__Modal">
      <div onClick={openModal} className="sidebarChat">
        <h2>Add New Chat</h2>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <h1>Create new chat</h1>
        <form onSubmit={(e) => createChat(e)}>
          <input
            placeholder="Room name"
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      </Modal>
    </div>
  ) : (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  );
}

export default SidebarChat;
