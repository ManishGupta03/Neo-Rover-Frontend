import React, { useEffect, useState, useRef,useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import bg3 from "../assets/bg-3.avif";
import GroupChatContainer from "../components/GroupChatContainer";
import { AuthContext } from "../Context/AuthContext";



export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  // const [groups, setGroups] = useState([]);
  const [showGroupMessage, setShowGroupMessage] = useState(false); 
  const [showGroupChatRoom, setShowGroupChatRoom] = useState(false);
  const [rerenderKey, setRerenderKey] = useState(0); // State to trigger re-render
  const { token} = useContext(AuthContext);


  const groupChatDetails = {
    _id: "group-chat-room",
    isGroup: true,
    groupId: "REACT_APP_GROUP_ID",
    username: "Group Chat"
  };


  useEffect(()=>{
  const fetchUp = async () => {
    if (!sessionStorage.getItem(token)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          sessionStorage.getItem(token)
        )
      );
    }
  }
  fetchUp();
}  , [navigate,token]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);// initializes a new Socket.IO client instance, connecting to the specified host (server).
      socket.current.emit("add-user", currentUser._id);// This line sends an event named "add-user" with the currentUser's ID as the payload to the server. This could be used to inform the server that a new user has connected.
    }
  }, [currentUser]);

  useEffect(()=>{
    const fetchContacts = async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }
  fetchContacts();
  }, [currentUser,navigate]);


  useEffect(() => {
    // Set a timer to show the group chat room after 5 seconds
    const timer = setTimeout(() => {
      if (currentChat === undefined) {
        setShowGroupChatRoom(true);
      }
    }, 5000);

    // Cleanup the timer if the component unmounts or currentChat changes
    return () => clearTimeout(timer);
  }, [currentChat]);


  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    if (chat.isGroup) {
      socket.current.emit("join-group", chat.groupId);
    }
  };

  const toggleGroupMessageContainer = () => {
    setShowGroupMessage(!showGroupMessage);
  };
  const rerenderChat = () => {
    setRerenderKey(prevKey => prevKey + 1);
  };


  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            showGroupChatRoom && socket.current ? (
              <GroupChatContainer
                currentChat={groupChatDetails} 
                socket={socket} 
                showGroupMessage={showGroupMessage} 
                toggleGroupMessageContainer={toggleGroupMessageContainer} 
              />
            ) : (
              <Welcome />
            )
          ) : (
            <ChatContainer 
            rerenderChat={rerenderChat}
            key={rerenderKey}
              currentChat={currentChat} 
              socket={socket} 
              showGroupMessage={showGroupMessage} 
              toggleGroupMessageContainer={toggleGroupMessageContainer} 
            />
          )}
        </div>
        
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background: url(${bg3}) no-repeat;
    background-size: cover;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
    .button {
     padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #ff0040;
    color: #d1d1d1;
    cursor: pointer;
    }
`;
