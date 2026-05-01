import React, { useState, useEffect } from 'react'
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import styled from 'styled-components';



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, setUserData } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token) {
      if (user && user.usertype === 'admin') {
        navigate("/admin/dashboard");
      } else if (user && user.usertype === 'gym') {
        navigate("/gym/dashboard");
      }
    }
  }, []);

  return (
    <LoginContainer>
      <StyledForm onSubmit={async (e) => {
        e.preventDefault();

        try {
          const response = await api.post('/admin/login', { username, password });
          if (response.status === 200) {
            if (response.data.token) {
              await setUserData({
                usertype: 'admin',
                userid: response.data.user.id
              });
              await login(response.data.token);
              navigate("/admin/dashboard");
            } else {
              alert("Login failed");
            }
          } else {
            alert('Login failed: ' + response.data.message);
          }
        } catch (error) {
          console.error('Login error:', error.message);
          // alert('Login failed: ' + (error.response ? error.response.data.message : error.message));
          try {
            const gymResponse = await api.post('/gym/login', { username, password });
            if (gymResponse.status === 200) {
              alert('Gym login successful: ' + gymResponse.data.message);
              await setUserData({
                usertype: 'gym',
                userid: gymResponse.data.user.id
              });
              await login(gymResponse.data.token);
              navigate("/gym/dashboard");
            } else {
              alert('Gym login failed: ' + gymResponse.data.message);
            }
          } catch (gymError) {
            console.error('Gym login error:', gymError.message);
            alert('Gym login failed: ' + (gymError.response ? gymError.response.data.message : gymError.message));
          }
        }
      }}>
        <div>
          <label>Username:</label>
          <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </StyledForm>
    </LoginContainer>
  )
}

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  div {
    margin-bottom: 15px;
    label
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }
  button {
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #0056b3;
    }
  }
`;

export default Login
