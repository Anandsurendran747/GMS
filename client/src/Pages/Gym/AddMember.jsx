import React, { useState, useEffect } from 'react'
import api from '../../api';
import styled from 'styled-components';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const AddMember = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        gymId: JSON.parse(localStorage.getItem("user")).gymId,
        name: '',
        phone: '',
        advanceAmount: '',
        planId: '',
        place: '',
        paidDate: new Date().toISOString().split('T')[0] // Set to current date in YYYY-MM-DD format
    });

    const [plans, setPlans] = useState([]);
    useEffect(() => {
        const gymId = JSON.parse(localStorage.getItem("user")).gymId;
        api.get(`/gym/plans/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            params: { gymId: gymId }

        }).then(response => {
            setPlans(response.data.plans);
        }).catch(error => {
            console.error('Error fetching plans:', error);
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please log in again.');
                logout();
            }
            alert('Failed to fetch plans: ' + (error.response ? error.response.data.msg : error.msg));
        });
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post('/gym/add-member', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => {
                console.log(response.data);
                alert("Member added successfully!");
                navigate('/gym/dashboard/manage-members');
            })
            .catch(error => {
                console.error(error);
                alert('Failed to add member: ' + (error.response ? error.response.data.msg : error.msg));
            });
    };

    return (
        <AddMemberContainer>
            <AddMemberForm onSubmit={handleSubmit}>
                <AddMemberSubContainer>
                    <InputLabel>Name:</InputLabel>
                    <AddMemberInput type="text" name="name" placeholder="Enter name" value={formData.name} onChange={handleChange} />
                </AddMemberSubContainer>
                <AddMemberSubContainer>
                    <InputLabel>Phone Number:</InputLabel>
                    <AddMemberInput type="tel" name="phone" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} />
                </AddMemberSubContainer>
                <AddMemberSubContainer>
                    <InputLabel>Advance Paid:</InputLabel>
                    <AddMemberInput type="number" name="advanceAmount" placeholder="Enter advance paid" value={formData.advanceAmount} onChange={handleChange} />
                </AddMemberSubContainer>
                <AddMemberSubContainer>
                    <InputLabel>Place:</InputLabel>
                    <AddMemberInput type="text" name="place" placeholder="Enter place" value={formData.place} onChange={handleChange} />
                </AddMemberSubContainer>
                <AddMemberSubContainer>
                    <InputLabel>Plan:</InputLabel>
                    <GymPlanSelect name="planId" value={formData.planId} onChange={handleChange}>
                        <option value="">Select a plan</option>
                        {plans.map(plan => (
                            <GymPlanOption key={plan._id} value={plan._id}>
                                {plan.name} - {plan.price}/month - {plan.durationDays} days
                            </GymPlanOption>
                        ))}
                    </GymPlanSelect>
                </AddMemberSubContainer>
                <AddMemberSubContainer>
                    <InputLabel>Paid Date:</InputLabel>
                    <AddMemberInput type="date" name='paidDate' value={formData.paidDate} onChange={handleChange} />
                </AddMemberSubContainer>
                <AddMemberButton type="submit">Add Member</AddMemberButton>
            </AddMemberForm>
        </AddMemberContainer>
    )
}

const AddMemberContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f0f2f5;
    height: 100vh;
`;

const AddMemberSubContainer = styled.div`
    background-color: white;
    padding: 5px;
    border-radius: 8px;
`;


const AddMemberForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
`;

const AddMemberInput = styled.input`
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const AddMemberButton = styled.button`
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
const GymPlanSelect = styled.select`
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    color: #333;
    &:focus {
        outline: none;
        border-color: rgb(12, 61, 66);
    }
`;
const GymPlanOption = styled.option`
    padding: 10px;
    font-size: 16px;
    background-color: white;
    color: #333;
    &:hover {
        background-color: #f0f0f0;
    }
`;
export default AddMember
