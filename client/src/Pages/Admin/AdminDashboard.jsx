import React, { useEffect } from 'react'
import api from '../../api';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  useEffect(() => {
    api.get('/admin/dashboard', {
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
    <DashboardContainer>
      <LogoutButton onClick={logout}>Logout</LogoutButton>
      <h1>Admin Dashboard</h1>
      <ButtonGrid>
        <AdminDashboardButton onClick={() => navigate('/admin/add-gym')}>Add Gym</AdminDashboardButton>
        <AdminDashboardButton onClick={() => navigate('/admin/gyms')}>Manage Gyms</AdminDashboardButton>
        <AdminDashboardButton onClick={() => navigate('/admin/settings')}>Settings</AdminDashboardButton>
      </ButtonGrid>
    </DashboardContainer>
  )
}

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const AdminDashboardButton = styled.button`
  padding: 20px;
  font-size: 18px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  &:hover {
    background-color: #0056b3;
  }
`;

const LogoutButton = styled.button`
position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  &:hover {
    background-color: #c82333;
  }
`;

export default AdminDashboard
