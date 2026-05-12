import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
const ManagePlan = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get('/gym/plans', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    params: {
                        gymId: JSON.parse(localStorage.getItem("user")).userid
                    }
                },);
                await setPlans(response.data.plans);
            } catch (error) {
                console.error('Error fetching plans:', error.message);
                alert('Error fetching plans: ' + (error.response ? error.response.data.msg : error.msg));
            }
        };
        fetchPlans();
    }, []);

    return (
        <ManagePlanContainer>
            <AddPlanButton onClick={() => navigate('/gym/dashboard/add-plan')}>
                Add New Plan
            </AddPlanButton>
            <ViewPlansContainer>
                {plans.length === 0 ? (
                    <p>No plans available. Please add a new plan.</p>
                ) : (
                    plans.map((plan) => (
                        <PlanItem key={plan._id}>
                            <PlanDetails>
                                <PlanName>{plan.name}</PlanName>
                                <PlanPrice>{plan.price}/month</PlanPrice>
                                <PlanDuration>{plan.durationDays} Days</PlanDuration>
                            </PlanDetails>
                            <EditPlanButton onClick={() => navigate(`/gym/edit-plan/${plan._id}`)}>
                                Edit
                            </EditPlanButton>
                        </PlanItem>
                    ))
                )}
            </ViewPlansContainer >
        </ManagePlanContainer >
    )
}

const ManagePlanContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f2f5;
    padding: 20px;
    height: 100vh;
`;

const ViewPlansContainer = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    margin-top: 20px;
`;

const PlanItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
`;

const PlanDetails = styled.div`
    display: flex;
    flex-direction: column;
`;
const PlanName = styled.span`
    font-weight: bold;
    font-size: 18px;
`;
const PlanPrice = styled.span`
    color: #555;
    font-size: 16px;
`;
const PlanDuration = styled.span`
    color: #555;
    font-size: 16px;
`;

const AddPlanButton = styled.button`
    padding: 10px;
    font-size: 16px;
    background-color: rgb(84, 129, 136);
    color: white;
    border: none;   
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: rgb(43, 114, 122);
    }
`;

const EditPlanButton = styled.button`
    padding: 5px 10px;
    font-size: 14px;
    background-color: rgb(12, 61, 66);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: rgb(84, 129, 136);
    }
`;

export default ManagePlan
