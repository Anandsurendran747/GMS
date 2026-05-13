
import PrivateRoute from './routes/PrivateRoute';
import './App.css';
import { AuthProvider } from './Contexts/AuthContext';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import GymDashboard from './Pages/Gym/GymDashboard';
// import AddGymRat from './Pages/Gym/AddGymRat';
import Login from './Pages/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddGym from './Pages/Admin/AddGym';
import AddMember from './Pages/Gym/AddMember';
import ManagePlan from './Pages/Gym/ManagePlan';
import AddPlan from './Pages/Gym/AddPlan';
import ManageMembers from './Pages/Gym/ManageMembers';
import ManageTrainers from './Pages/Gym/ManageTrainers';
import Unauthorized from './Pages/Unauthorized';
import DashBoardMain from './Containers.jsx/DashBoardMain';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/add-gym" element={<PrivateRoute allowedRoles={['admin']}><AddGym /></PrivateRoute>} />
            <Route path="/gym/dashboard" element={<PrivateRoute allowedRoles={['gym']}><GymDashboard /></PrivateRoute>} >
              <Route index element={<PrivateRoute allowedRoles={['gym']}><DashBoardMain /></PrivateRoute>} />
              <Route path="add-member" element={<PrivateRoute allowedRoles={['gym']}><AddMember /></PrivateRoute>} />
              <Route path="manage-members" element={<PrivateRoute allowedRoles={['gym']}><ManageMembers /></PrivateRoute>} />
              <Route path="manage-plans" element={<PrivateRoute allowedRoles={['gym']}><ManagePlan /></PrivateRoute>} />
              <Route path="add-plan" element={<PrivateRoute allowedRoles={['gym']}><AddPlan /></PrivateRoute>} />
              <Route path="manage-trainers" element={<PrivateRoute allowedRoles={['gym']}><ManageTrainers /></PrivateRoute>} />
              <Route path="unauthorized" element={<Unauthorized />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
