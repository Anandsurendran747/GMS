import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import api from '../../api';
import { useAuth } from '../../Contexts/AuthContext';


const ManageMembers = () => {
    const [members, setMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        // Fetch members from your API or data source
        const fetchMembers = async () => {
            try {
                const response = await api.get('/gym/members', {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    params: {
                        gymId: JSON.parse(localStorage.getItem("user")).userid
                    }
                });
                await setMembers(response.data.members ? response.data.members : []);
                console.log(members);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchMembers();
    }, []);

    const totalPages = Math.ceil(members.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMembers = members.slice(startIndex, startIndex + itemsPerPage);

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
        <ManageMembersContainer>
            <h1>Manage Members</h1>
            <ViewMembersContainer>
                <MembersTable>
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Place</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedMembers.length > 0 ? (
                            paginatedMembers.map((member, index) => (
                                <tr key={member._id}>
                                    <td>#{startIndex + index + 1}</td>
                                    <td>{member.name}</td>
                                    <td>{member.phone}</td>
                                    <td>{member.place}</td>
                                    <td style={{ display: 'flex', gap: '10px' }}>
                                        <EditMemberButton>Edit</EditMemberButton>
                                        <DeleteMemberButton>Delete</DeleteMemberButton>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No members to display. Please add members to manage them.</td></tr>
                        )}
                    </tbody>
                </MembersTable>
                <PaginationContainer>
                    <PaginationButton onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                    </PaginationButton>
                    <PageInfo>Page {currentPage} of {totalPages}</PageInfo>
                    <PaginationButton onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                    </PaginationButton>
                </PaginationContainer>
            </ViewMembersContainer>
        </ManageMembersContainer>
    )
}

const ManageMembersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
    background-color: rgb(12, 61, 66);
    padding: 20px;
    height: 100vh;
`;
const MembersTable = styled.table`
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

const ViewMembersContainer = styled.div`
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

const EditMemberButton = styled.button`
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

const DeleteMemberButton = styled.button`
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

export default ManageMembers
