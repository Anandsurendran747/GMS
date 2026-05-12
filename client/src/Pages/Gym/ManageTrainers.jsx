import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import api from '../../api';


const ManageTrainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        // Fetch trainers from your API or data source
        const fetchTrainers = async () => {
            try {
                const response = await api.get('/gym/trainers', {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    params: {
                        gymId: JSON.parse(localStorage.getItem("user")).userid
                    }
                });
                await setTrainers(response.data.trainers ? response.data.trainers : []);
                console.log(trainers);
            } catch (error) {
                console.error('Error fetching trainers:', error);
            }
        };

        fetchTrainers();
    }, []);

    const totalPages = Math.ceil(trainers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTrainers = trainers.slice(startIndex, startIndex + itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <ManageTrainersContainer>
            <ViewTrainersContainer>
                <TrainersTable>
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Name</th>
                            <th>Specialization</th>
                            <th>Experience</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTrainers.length > 0 ? (
                            paginatedTrainers.map((trainer, index) => (
                                <tr key={trainer._id}>
                                    <td>#{startIndex + index + 1}</td>
                                    <td>{trainer.name}</td>
                                    <td>{trainer.specialization}</td>
                                    <td>{trainer.experience}</td>
                                    <td>{trainer.availability}</td>
                                    <td style={{ display: 'flex', gap: '10px' }}>
                                        <EditTrainerButton>Edit</EditTrainerButton>
                                        <DeleteTrainerButton>Delete</DeleteTrainerButton>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No trainers to display. Please add trainers to manage them.</td></tr>
                        )}
                    </tbody>
                </TrainersTable>
                <PaginationContainer>
                    <PaginationButton onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                    </PaginationButton>
                    <PageInfo>Page {currentPage} of {totalPages}</PageInfo>
                    <PaginationButton onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                    </PaginationButton>
                </PaginationContainer>
            </ViewTrainersContainer>
        </ManageTrainersContainer>
    )
}

const ManageTrainersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
    background-color: #f0f2f5;
    padding: 20px;
    height: 100vh;
`;
const TrainersTable = styled.table`
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  margin-top: 20px;

  thead tr {
    background-color: rgb(84, 129, 136);
    color: white;
  }

  th, td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
    word-break: break-word;
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  @media (max-width: 768px) {
    min-width: 0;

    th, td {
      padding: 10px;
      font-size: 14px;
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: rgb(84, 129, 136);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    &:hover:enabled {
        background-color: rgb(12, 61, 66);
    }
`;

const PageInfo = styled.span`
  margin: 0 15px;
  font-size: 16px;
    color: white;
`;

const ViewTrainersContainer = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 100%;
    margin-top: 20px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    @media (max-width: 768px) {
      width: 100%;
      padding: 16px;
    }
`;

const EditTrainerButton = styled.button`
    padding: 10px;
    font-size: 16px;
    background-color: rgb(84, 129, 136);
    color: white;
    border: none;   
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: rgb(12, 61, 66);
    }
`;

const DeleteTrainerButton = styled.button`
    padding: 10px;
    font-size: 16px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: #c82333;
    }
`;

export default ManageTrainers
