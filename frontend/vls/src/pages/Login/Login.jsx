import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "./assets/logo.png";
// Login component
function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function setCookie(val, value, days) {
    const expires = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toUTCString();
    document.cookie = `${val}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }
  // Function to get a cookie
  function getCookie(val) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === val) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }
  // Function to delete a cookie
  function deleteCookie(val) {
    document.cookie = `${val}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  // Function to handle the email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  // Function to handle the password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  // Function to handle the form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "")
      return toast.warn('Please fill in all fields', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });      
    try {
      const response = await axios.post("http://localhost:6500/login", {
        email,
        password,
      });
      console.log(response.data.data);
      if (response.data.data.premission) {
        if (!getCookie(email)) {
          setCookie("email", email, 30);
          console.log(getCookie("email"));
          if (response.data.data.premission === "admin") {
            navigate("/homeAdmin", { replace: true });
          }
          if (response.data.data.premission === "company") {
            setCookie("company", response.data.data.company, 30);
            navigate("/homeCompany", { replace: true });
          }
        }
      } else {
        deleteCookie("email");
        return toast.error('Invalid credentials', {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        });  
      }
    } catch (error) {
      console.error("Error:", error);
      return toast.error('Error logging in. Please try again.', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });  
    }
  };
  const handleForgotPass = () => {
    navigate("/forgotpassword", { replace: true });
  };

  return (
    <>
    <ToastContainer />
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={logo} style={{ width: "30%" }} alt="Example" />
          <h1 style={{ marginBottom: "20px" }}>Welcome to Nicer Debt</h1>
        </div>
        <h1 className="titlee" style={{ fontSize: "48px" }}>
          Sign in
        </h1>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button>Sign In</button>
        <h1 style={{ marginTop: "50px", fontSize: "48px" }}>
          {" "}
          forgot your password ?
        </h1>
        <button onClick={handleForgotPass}>click here</button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </>
  );
}

export default Login;
