import React, { useEffect, useState } from "react";
import "./styles.css";
import './animation.css'
import Login from "./Login";
import Register from "./Register";
import { useLocation } from "react-router-dom";
import axios from "axios";

// FirstPage component
function FirstPage() {
  const location = useLocation();

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function(event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [location]);
  const [type, setType] = useState("signIn");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="App">
      <div className={containerClass} id="container">
        <Register />
        <Login />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 style={{fontSize: "48px"}}>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
                style = {{
                  border: "1px solid #202020",
                  backgroundColor: "#191919"
              }}              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 style={{fontSize: "48px"}}>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="signUpBtn ghost"
                id="signUp"
                onClick={() => handleOnClick("signUp")}
                style = {{
                    border: "1px solid #202020",
                    backgroundColor: "#191919"
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirstPage;
