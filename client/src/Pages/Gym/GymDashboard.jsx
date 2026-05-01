import React, { useEffect } from 'react'
import styled from 'styled-components';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
const GymDashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url('/gym1.jpg');
  background-size: cover;
  background-position: center;
`;
const GymDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  useEffect(() => {
    api.get('/gym/dashboard', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => {

      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        console.error('Error fetching admin dashboard data:', error.message);
      });
  }
    , []);

  return (
    <GymDashboardContainer>
      <LogoutButton onClick={logout}>Logout</LogoutButton>
      <GymDashboardTitle>Welcome to the Gym Dashboard</GymDashboardTitle>
      <GymDashboardButtonGrid>
        <GymDashboardButton onClick={() => navigate('/gym/add-member')}>Add Member</GymDashboardButton>
        <GymDashboardButton onClick={() => navigate('/gym/manage-members')}>Manage Members</GymDashboardButton>
        <GymDashboardButton onClick={() => navigate('/gym/manage-plans')}>Manage Plans</GymDashboardButton>
        <GymDashboardButton onClick={() => navigate('/gym/track-attendance')}>Track Attendance</GymDashboardButton>
        <GymDashboardButton onClick={() => navigate('/gym/settings')}>Settings</GymDashboardButton>
      </GymDashboardButtonGrid>
    </GymDashboardContainer>
  )
}



const LogoutButton = styled.button`
position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #7e2830;
  color: white;
  border: none;
  border-radius: 4px;
  &:hover {
    background-color: #c82333;
  }
`;

const GymDashboardButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 8px;
`;

const GymDashboardButton = styled.button`
  padding: 20px;
  font-size: 18px;
  cursor: pointer;
  background-color: rgb(12, 61, 66);  
  color: white;
  border: none;
  border-radius: 8px;
  &:hover {
    background-color: rgb(84, 129, 136);
  }
`;

const GymDashboardTitle = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;



export default GymDashboard
