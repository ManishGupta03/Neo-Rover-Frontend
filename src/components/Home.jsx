import React from 'react';
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import bg3 from "../assets/bg-3.avif";
import { useNavigate} from "react-router-dom";

export default function Home () {
 const navigate = useNavigate();
    const handle = async (event) => {
        event.preventDefault();
         navigate('/login')
    }
  return (
    <Container>
        <div className="adjust"><button className='button' onClick={(event)=>handle(event)}> LogIn</button></div>
    <img src={Robot} alt="" />
    <h1>
      Welcome, <span>Folks !!!</span>
    </h1>
    <h3>Please select a chat to Start messaging.</h3>
    
  </Container>
  )
}
const Container = styled.div`
height:100vh;
  display: flex;
  justify-content: center;
  
  align-items: center;
  color: white;
  flex-direction: column;
   background: url(${bg3}) no-repeat;
    background-size: cover;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
     .button {
     display:flex;
     justify-content:flex-end;
     padding: 15px 25px;
    border: none;
    border-radius: 5px;
    background-color: #ff0040;
    color: #d1d1d1;
    cursor: pointer;
    font-size:20px;
    }
    .adjust{
     margin-top: -100px; /* Pushes the .adjust div to the bottom */
    display: flex;
    justify-content: flex-end;
    width: 100%; /* Ensures full width alignment */
    padding-right: 3rem; /* Adds right padding to adjust alignment */
    }
`;


