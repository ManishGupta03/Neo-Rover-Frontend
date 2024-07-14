import React,{useContext} from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
import { AuthContext } from "../Context/AuthContext";

export default function Logout() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);


  const handleClick = async () => {
    const id = await JSON.parse(
      sessionStorage.getItem(token)
    )._id;
    // console.log(id);
    const data = await axios.post(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      sessionStorage.clear();
      navigate("/login");
    }
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
