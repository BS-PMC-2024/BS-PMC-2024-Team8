import React from "react";
import axios from "axios";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Register component to display the registration form
function Register() {
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: "",
    country: "",
    company: "",
    sector: "",
  });
  // Handel changes on the inputs
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    console.log(evt.target);
    setState({
      ...state,
      [name]: value,
    });
  };
  // check for password that contain symbols
  const passwordContainsSymbols = (password) => {
    const symbols = [
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "_",
      "+",
      "-",
      "=",
      "[",
      "]",
      "{",
      "}",
      ";",
      ":",
      "'",
      '"',
      "\\",
      "|",
      ",",
      ".",
      "<",
      ">",
      "/",
      "?",
    ];
    return symbols.some((symbol) => password.includes(symbol));
  };
  // check for password that contain numbers
  const passwordContainsnNumbers = (password) => {
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return numbers.some((number) => password.includes(number));
  };
  // Function to handle the form submit
  const handleOnSubmit = async (evt) => {
    evt.preventDefault();


    if(!state.name || !state.email || !state.password || !state.country || !state.company) return toast.error("Please fill in all fields. if you don't have an apartment number, please fill in 0.", {
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
    if((state.password.length < 8) ) return toast.error("Password must be at least 8 characters long.", {
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
    if(!passwordContainsSymbols(state.password)) return toast.error("Password must contain at least one symbol.", {
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
    if(!passwordContainsnNumbers(state.password)) return toast.error("Password must contain numbers.", {
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
    try{const user = await axios.get(`http://localhost:6500/${state.email}`);
    if(user) return toast.warn('User already exists, please log in.', {
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
    return;
  }
    catch (error) {

      console.error("Error:", error);
      toast.error('internal error on server, please try later.', {
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
    try {
      const response = await axios.post("http://localhost:6500/register", {
        full_name: state.name,
        email: state.email,
        password: state.password,
        country: state.country,
        company: state.company,
        sector: state.sector,
      });
      setState({
        name: "",
        email: "",
        password: "",
        country: "",
        company: "",
        sector: "",
      });


      toast.success('User created successfully', {
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

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
    <ToastContainer />
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1 className="titleb" style={{ fontSize: "48px" }}>
          Create Account
        </h1>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          type="text"
          name="country"
          value={state.country}
          onChange={handleChange}
          placeholder="Country"
        />
        <input
          type="text"
          name="company"
          value={state.company}
          onChange={handleChange}
          placeholder="Company"
        />
        <FormControl
          fullWidth
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <InputLabel style={{ color: "white" }} id="sector-select-label">
            Sector
          </InputLabel>
          <Select
            labelId="sector-select-label"
            id="sector-select"
            value={state.sector}
            label="Sector"
            name="sector"
            onChange={handleChange}
          >
            <MenuItem value="Telecom">Telecom</MenuItem>
            <MenuItem value="Insurance">Insurance</MenuItem>
            <MenuItem value="Tech">Tech</MenuItem>
            <MenuItem value="Health">Health</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <button type="submit">Sign Up</button>
      </form>
    </div>
    </>
  );
}

export default Register;
