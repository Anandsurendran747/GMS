
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

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/gym/dashboard" element={<PrivateRoute><GymDashboard /></PrivateRoute>} />
            <Route path="/admin/add-gym" element={<PrivateRoute><AddGym/></PrivateRoute>} />
            <Route path="/gym/add-member" element={<PrivateRoute><AddMember/></PrivateRoute>} />
            <Route path="/gym/manage-plans" element={<PrivateRoute><ManagePlan /></PrivateRoute>} />
            <Route path="/gym/add-plan" element={<PrivateRoute><AddPlan /></PrivateRoute>} />
            <Route path="/gym/manage-members" element={<PrivateRoute><ManageMembers /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
