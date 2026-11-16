import { Navigate, Route, Routes } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout.jsx';
import ManagerLayout from './layouts/ManagerLayout.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding/1" replace />} />

      <Route path="/onboarding/:step" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<CustomerLayout />}>
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/new-repair" element={<PlaceholderPage title="New repair" owner="Student 2" />} />
        <Route path="/track" element={<PlaceholderPage title="Track a request" owner="Student 2" />} />
        <Route path="/requests/:id" element={<PlaceholderPage title="Request details" owner="Student 2" />} />
        <Route path="/help" element={<PlaceholderPage title="Repair help" owner="Student 2" />} />
        <Route path="/devices" element={<PlaceholderPage title="My devices" owner="Student 3" />} />
        <Route path="/devices/new" element={<PlaceholderPage title="Add a device" owner="Student 3" />} />
        <Route path="/devices/:id/edit" element={<PlaceholderPage title="Edit device" owner="Student 3" />} />
        <Route path="/devices/:id" element={<PlaceholderPage title="Device details" owner="Student 3" />} />
        <Route path="/history" element={<PlaceholderPage title="Repair history" owner="Student 3" />} />
        <Route path="/profile" element={<PlaceholderPage title="Profile" owner="Student 4" />} />
        <Route path="/settings" element={<PlaceholderPage title="Settings" owner="Student 4" />} />
      </Route>

      <Route element={<ManagerLayout />}>
        <Route path="/manager/dashboard" element={<PlaceholderPage title="Manager dashboard" owner="Student 4" />} />
        <Route path="/manager/requests" element={<PlaceholderPage title="Manage requests" owner="Student 4" />} />
        <Route path="/manager/requests/:id" element={<PlaceholderPage title="Manager request details" owner="Student 4" />} />
      </Route>

      <Route path="*" element={<PlaceholderPage title="Page not found" owner="FixFlow" />} />
    </Routes>
  );
}

export default App;
