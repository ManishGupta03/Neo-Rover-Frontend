import React, { useState, useEffect,useContext } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import { AuthContext } from "../Context/AuthContext";


export default function Welcome() {
  const [userName, setUserName] = useState("");
  const { token} = useContext(AuthContext);

  useEffect(()=>{
    const usernameSet = async () => {
    setUserName(
      await JSON.parse(
        sessionStorage.getItem(token)
      ).username
    );
  }
  usernameSet();
  }, []);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Your Broadcast will Start soon... !!!</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
