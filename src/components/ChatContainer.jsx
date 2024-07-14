import React, { useState, useEffect, useRef,useContext } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { useNavigate} from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";


export default function ChatContainer({ rerenderChat, renderKey, currentChat, socket, showGroupMessage, toggleGroupMessageContainer, }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const navigate = useNavigate();
  const { token} = useContext(AuthContext);

  useEffect( ()=>{
    const fetchMessages = async () => {
    const data = await JSON.parse(sessionStorage.getItem(token));
    const response = await axios.post(recieveMessageRoute, { from: data._id,to: currentChat._id, isGroup: currentChat.isGroup, groupId: currentChat.groupId,username:data.username, });
    setMessages(response.data);
  }
  fetchMessages();
    
  }, [currentChat,token]);
//localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(sessionStorage.getItem(token))._id;
      }
    };
    getCurrentChat();
  }, [currentChat,token]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(sessionStorage.getItem(token) );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
      isGroup: currentChat.isGroup,
      groupId: currentChat.groupId,
      username:data.username,
    });
    // console.log(data._id);
    // console.log(currentChat._id);
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
      isGroup: currentChat.isGroup,
      groupId: currentChat.groupId,
      username:data.username,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg, username:data.username });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg,username) => {
        setArrivalMessage({ fromSelf: false, message: msg, username:username });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handle = async (event) => {
    event.preventDefault();
    rerenderChat();
     navigate('/chat')
}

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <div className="adjust"><button className='button' onClick={(event)=>handle(event)}> Group</button></div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div className={`message ${ message.fromSelf ? "sended" : "recieved" }`} >
              <div className="content">
              <div className="adj">
                  <p className="userm"> {message.username}:</p>
                  <p className="userms">{message.message}</p>
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
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
       .button {
     display:flex;
     justify-content:flex-end;
     padding: 9px 15px;
    border: none;
    border-radius: 5px;
    background-color: #ff0040;
    color: #d1d1d1;
    cursor: pointer;
    font-size:15px;
    }
    .adjust{
     margin-top: 0px; /* Pushes the .adjust div to the bottom */
     margin-right:-20px;
    display: flex;
    justify-content: flex-end;
    width: 100%; /* Ensures full width alignment */
    padding-right: 3rem; /* Adds right padding to adjust alignment */
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
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
            .adj{
               display:flex;
          }
          .userm{
                  margin-top:-7px;
                  text-align:left;
                  font-size:0.5rem;
          }
          .userms{
          text-align:left;
          margin-left:-10px;
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
