import React, { useState } from 'react'
import styled from 'styled-components';
import api from '../../api';
const AddGym = () => {

  const [formData, setFormData] = useState({
    name: '',
    place: '',
    ownerName: '',
    phone: '',
    email: '',
    username: '',
    password: '',
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/admin/add-gym', formData);
      if (response.status === 201) {
        alert('Gym added successfully');
        setFormData({
          name: '',
          place: '',
          ownerName: '',
          phone: '',
          email: '',
          username: '',
          password: '',
        });
      } else {
        alert('Error adding gym: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error adding gym:', error.message);
      alert('Error adding gym' + (error.response ? ': ' + error.response.data.message : ''));
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  return (
    <AddGymContainer>
      <AddGymTitle>Add Gym</AddGymTitle>
      <AddGymForm onSubmit={handleSubmit}>
        <AddGymInput
          type="text"
          placeholder="Gym Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <AddGymInput
          type="text"
          name="place"
          placeholder="Gym Place"
          value={formData.place}
          onChange={handleChange}
        />
        <AddGymInput
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          value={formData.ownerName}
          onChange={handleChange}
        />
        <AddGymInput
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />
        <AddGymInput
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <AddGymInput
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <AddGymInput
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <AddGymButton type="submit">Add Gym</AddGymButton>
      </AddGymForm>
    </AddGymContainer>
  )
}

const AddGymContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const AddGymForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  width: 400px;
`;

const AddGymInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const AddGymButton = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
}`;

const AddGymTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;



export default AddGym
