import React, { useState } from 'react'
import styled from 'styled-components';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
const AddPlan = () => {
    const navigate = useNavigate();
    const [planName, setPlanName] = useState('');
    const [planDuration, setPlanDuration] = useState('');
    const [planPrice, setPlanPrice] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const gymId = JSON.parse(localStorage.getItem("user")).userid;
        const planData = {
            gymId: gymId,
            name: formData.get('name'),
            durationDays: formData.get('duration'),
            price: formData.get('price')
        };
        try {
            api.post('/gym/add-plan', planData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then(response => {
                    console.log(response.data);
                    alert("Plan added successfully!");
                    navigate('/gym/manage-plans');
                }
                )
                .catch(error => {
                    console.error(error);
                    alert('Failed to add plan: ' + (error.response ? error.response.data.msg : error.msg));
                });
        } catch (error) {
            console.error('Error adding plan:', error.message);
            alert('Error adding plan: ' + (error.response ? error.response.data.msg : error.msg));
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') setPlanName(value);
        else if (name === 'duration') setPlanDuration(value);
        else if (name === 'price') setPlanPrice(value);
    };

    return (
        <div>
            <AddPlanContainer>
                <AddPlanForm onSubmit={handleSubmit}>
                    <InputLabel>Plan Name</InputLabel>
                    <AddPlanInput
                        type="text"
                        name="name"
                        placeholder="Enter plan name"
                        value={planName}
                        onChange={handleChange}
                    />
                    <InputLabel>Plan Duration</InputLabel>
                    <AddPlanInput
                        type="text"
                        name="duration"
                        placeholder="Enter plan duration"
                        value={planDuration}
                        onChange={handleChange}
                    />
                    <InputLabel>Plan Price</InputLabel>
                    <AddPlanInput
                        type="number"
                        name="price"
                        placeholder="Enter plan price"
                        value={planPrice}
                        onChange={handleChange}
                    />
                    <AddPlanButton type="submit">Add Plan</AddPlanButton>
                </AddPlanForm>
            </AddPlanContainer>
        </div>
    )
}
const AddPlanContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f2f5;
    padding: 20px;
    height: 100vh;
`;

const AddPlanForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
`;

const AddPlanInput = styled.input`
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const AddPlanButton = styled.button`
    padding: 10px;
    font-size: 16px;
    background-color: rgb(12, 61, 66);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: rgb(84, 129, 136);
    }
`;



const InputLabel = styled.label`
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
    color: rgb(12, 61, 66);
`;


export default AddPlan
