import React, { useState, useEffect, useRef,useContext } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import group from "../assets/group.jpg";
import { AuthContext } from "../Context/AuthContext";



export default function GroupChatContainer({ currentChat, socket, showGroupMessage, toggleGroupMessageContainer }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const { token} = useContext(AuthContext);
  

  // Hardcoded group ID
  const groupId = "REACT_APP_GROUP_ID"; // Replace this with your actual group ID


  useEffect(() => {
    if (socket.current) {
      socket.current.emit("join-group", groupId); // Ensure user joins the group room
    }
  }, [ socket]);


  useEffect(() => {
    let mounted = true;
    const fetchMessages = async () => {
        try {
      const data = await JSON.parse(sessionStorage.getItem(token) );
      const response = await axios.post(recieveMessageRoute, { from: data._id, to:groupId, });
      if (mounted) {
        setMessages(response.data); // Only update state if component is still mounted
      }
    }
    catch (error) {
      console.error("Failed to fetch messages", error);
    }
    };
    fetchMessages();
    return () => {
        mounted = false; // Set mounted to false when component unmounts
      };
  }, [token]);
  //groupId

  useEffect(() => {
    const getCurrentChat = async () => {
      if (groupId) {
        await JSON.parse(sessionStorage.getItem(token))._id;
      }
    };
    getCurrentChat();
  }, [token]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse( sessionStorage.getItem(token));
    const timestamp = new Date().toLocaleTimeString();
    socket.current.emit("send-msg", {
      to: groupId,
      from: data._id,
      isGroup: true,
      groupId:groupId,
      username:data.username,
      msg,
      timestamp:timestamp,
    });

    await axios.post(sendMessageRoute, {
      from: data._id,
      to: groupId,
      message: msg,
      isGroup: true,
      groupId: groupId,
      username:data.username,
      timestamp:timestamp,
    });
//username:data.username,
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg, username:data.username,timestamp:timestamp });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg,username,timestamp) => {
        setArrivalMessage({ fromSelf: false, message: msg, username:username,timestamp:timestamp});
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={group} alt=""/>
          </div>
          <div className="username">
            <h3>Broadcast</h3>
          </div>
        </div>
        
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                <div className="content">
                  <div className="adj">
                  <p className="userm"> {message.username}:</p>
                  <p className="userms">{message.message}</p>
                  <p className="timestamp">{message.timestamp}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}
//
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 2rem;
          border-radius:50%;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .button {
      display: flex;
      justify-content: flex-end;
      padding: 9px 15px;
      border: none;
      border-radius: 5px;
      background-color: #ff0040;
      color: #d1d1d1;
      cursor: pointer;
      font-size: 15px;
    }
    .adjust {
      margin-top: 0px;
      margin-right: -20px;
      display: flex;
      justify-content: flex-end;
      width: 100%;
      padding-right: 3rem;
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        display:flex;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
          .adj{
               display:flex;
          }
          .userm{
                  margin-top:-8px;
                  text-align:left;
                  font-size:0.5rem;
                  color:yellow;
          }
          .userms{
          text-align:left;
          margin-left:-20px;
          }
           .timestamp {
          font-size: 0.55rem;
          color: gray;
          text-align: right;
          margin-top: 15px;
          gap: 3px;
          margin-right:-3px;
        }
          
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
