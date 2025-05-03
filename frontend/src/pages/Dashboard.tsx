import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./dashboard/Sidebar";
import MyRegistrations from "./dashboard/MyRegistrations";
import Profile from "./dashboard/Profile";
import DashboardHome from "./dashboard/DashboardHome";
import OrganizerDashboard from "./dashboard/OrganizerDashboard";
import CreateEvent from "./dashboard/CreateEvent";
import ManageEvents from "./dashboard/ManageEvents";
import ManageUsers from "./dashboard/ManageUsers";
import AuditLog from "./dashboard/AuditLog";
import toast from "react-hot-toast";

const Dashboard = () => {
  const storedUser = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  useEffect(() => {
    if (!storedUser) {
      navigate("/");
      toast.error("Please login first");
      location.reload();
    }
  }, [storedUser, navigate]);

  return (
    <div className="flex overflow-scroll" style={{ height: "90vh" }}>
      {role === "attendee" && <Sidebar role="attendee" />}
      {role === "organizer" && <Sidebar role="organizer" />}
      {role === "admin" && <Sidebar role="admin" />}

      <div className="flex-1 ml-64 p-4">
        <Routes>
          {/* Attendee routes */}
          {role === "attendee" && (
            <>
              <Route path="home" element={<DashboardHome />} />
              <Route path="myregistrations" element={<MyRegistrations />} />
              <Route path="profile" element={<Profile />} />
            </>
          )}

          {/* Organizer routes */}
          {role === "organizer" && (
            <>
              <Route path="home" element={<OrganizerDashboard />} />
              <Route path="create-event" element={<CreateEvent />} />
              <Route path="events" element={<ManageEvents />} />
            </>
          )}

          {/* Admin routes */}
          {role === "admin" && (
            <>
              <Route path="home" element={<ManageUsers />} />
              <Route path="auditlog" element={<AuditLog />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};
export default Dashboard;
