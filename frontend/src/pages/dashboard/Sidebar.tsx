import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaCog,
  FaCalendarAlt,
  FaTicketAlt,
  FaClipboardList,
  FaPlusCircle,
  FaChartBar,
} from "react-icons/fa";

const Sidebar = ({ role }: { role: string }) => {
  const { pathname } = useLocation();

  const navLinkClass = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 ${
      pathname === path
        ? "bg-gray-800 text-white font-semibold"
        : "text-gray-300"
    }`;

  return (
    <div className="w-64 h-screen bg-black text-white fixed top-0 left-0 px-4 mt-16">
      <nav className="space-y-2">
        {role === "attendee" && (
          <>
            <div className="text-xs text-gray-400 uppercase px-4 mt-4 mb-1">
              Attendee
            </div>
            <Link
              to="/dashboard/home"
              className={navLinkClass("/dashboard/home")}
            >
              <FaHome /> Dashboard
            </Link>

            <Link
              to="/dashboard/myregistrations"
              className={navLinkClass("/dashboard/myregistrations")}
            >
              <FaTicketAlt />
              My Registrations
            </Link>
            <Link
              to="/dashboard/profile"
              className={navLinkClass("/dashboard/profile")}
            >
              <FaCalendarAlt /> Profile
            </Link>
          </>
        )}

        {role === "organizer" && (
          <>
            <div className="text-xs text-gray-400 uppercase px-4 mt-6 mb-1">
              Organizer
            </div>
            <Link
              to="/dashboard/home"
              className={navLinkClass("/dashboard/home")}
            >
              <FaChartBar /> Organizer Dashboard
            </Link>
            <Link
              to="/dashboard/create-event"
              className={navLinkClass("/dashboard/create-event")}
            >
              <FaPlusCircle /> Create Event
            </Link>
            <Link
              to="/dashboard/events"
              className={navLinkClass("/dashboard/events")}
            >
              <FaClipboardList /> Manage Events
            </Link>
          </>
        )}

        {role === "admin" && (
          <>
            <div className="text-xs text-gray-400 uppercase px-4 mt-6 mb-1">
              Admin
            </div>
            <Link
              to="/dashboard/home"
              className={navLinkClass("/dashboard/home")}
            >
              <FaUsers /> Manage Users
            </Link>
            <Link
              to="/dashboard/auditlog"
              className={navLinkClass("/dashboard/auditlog")}
            >
              <FaCog /> Audit Logs
            </Link>
          </>
        )}

        <Link
          to="/"
          className="block mt-6 text-red-400 hover:text-red-300 px-4"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }}
        >
          Logout
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
