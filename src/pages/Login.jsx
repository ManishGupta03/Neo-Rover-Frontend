import React, { useState,useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import bg3 from "../assets/bg-3.avif";
import NeoDove from "../assets/NeoDove-logo.png";
import { AuthContext } from "../Context/AuthContext";


export default function Login() {
  const { setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [values, setValues] = useState({ loginId: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,  //This sets the toast to automatically close after 8 seconds.
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  // useEffect(() => {
  //   if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
  //     navigate("/chat");
  //   }
  // }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { loginId, password } = values;
    if (loginId === "") {
      toast.error("loginId must be required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Password must be required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { loginId, password } = values;
        const { data } = await axios.post(loginRoute, {loginId, password});
       
      if (data.status === 500) {
        toast.error(data.message, toastOptions);
      }
      console.log(data.token);
      if (data.status === 200) {
        // localStorage.setItem(
        //   process.env.REACT_APP_LOCALHOST_KEY,
        //   JSON.stringify(data.user)
        // );
        setAuthToken(data.token, data.user);
        navigate("/chat");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <img src={NeoDove} alt="NeoDove" />
          </div>
          <input
            type="text"
            placeholder="Login ID"
            name="loginId"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
   background: url(${bg3}) no-repeat;
    background-size: cover;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2.5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
