import React, { useState } from 'react';
import "./App.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function App() {
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { email, name });
      if (response.status === 200) {
        Cookies.set('token', response.data.token);
        const shouldAllowRecording = window.confirm("Allow Webcam Recording && Audio Recording");
        if (shouldAllowRecording) {
          navigate('/recording');
        }
      } else {
        throw new Error("Error registering user");
      }
    
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="App">
      <h1 className="app-heading">Recording App</h1>
      <form className="app-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <br />
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
        <br />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
