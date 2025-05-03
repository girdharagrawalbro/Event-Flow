import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  User,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface Event {
  organizer: any;
  id: string;
  title: string;
  date: string;
  attendees?: number;
  score: number;
}

interface Organizer {
  id: string;
  name: string;
  eventsOrganized?: number;
  attendees?: number;
  role: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  trend?: string;
  className?: string;
}

interface EventCardProps {
  event: Event;
}

interface OrganizerCardProps {
  organizer: Organizer;
}

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch events
        const eventsResponse = await fetch(
          "https://eventflow-1wso.onrender.com/api/events"
        );
        const eventsData: Event[] = await eventsResponse.json();

        // Fetch users
        const usersResponse = await fetch(
          "https://eventflow-1wso.onrender.com/api/events/users"
        );
        const usersData: { data: Organizer[] } = await usersResponse.json();

        setEvents(eventsData);
        setUsers(usersData.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  const organizerCount = users.filter(user => user.role === 'organizer').length;
  const attenddeeCount = users.filter(user => user.role === 'attendee').length;
  // Calculate events organized by each organizer
  const organizersWithCounts = users
    .filter(organizer => organizer.role === "organizer")
    .map(organizer => ({
      ...organizer,
      eventsOrganized: events.filter(event => event.organizer?.id === organizer.id).length
    }));
  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Overview of events, organizers, and attendees
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Calendar size={20} />}
          title="Total Events"
          value={events.length}
        />
        <StatCard
          icon={<Clock size={20} />}
          title="Upcoming Events"
          value={events.filter(e => new Date(e.date) > new Date()).length}
          trend="happening soon"
          className="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<CheckCircle size={20} />}
          title="Live Events"
          value={events.filter(e => new Date(e.date) == new Date()).length}
          trend="happening today"
          className="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<XCircle size={20} />}
          title="Completed Events"
          value={events.filter(e => new Date(e.date) < new Date()).length}
          className="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          icon={<User size={20} />}
          title="Organizers"
          value={organizerCount}
          className="bg-purple-50 text-purple-600"
        />
        <StatCard
          icon={<Users size={20} />}
          title="Attendees"
          value={attenddeeCount}
          className="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* Recent Events and Top Organizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar size={18} /> Recent Events
          </h2>
          <div className="space-y-4">
            {events.length > 0 ? (
              events
                .slice(0, 5)
                .map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p className="text-gray-500 text-center py-4">No recent events</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User size={18} /> Top Organizers
          </h2>
          <div className="space-y-4">
            {organizersWithCounts.length > 0 ? (
              organizersWithCounts
                .sort((a, b) => b.eventsOrganized - a.eventsOrganized)
                .slice(0, 5)
                .map((organizer) => (
                  <OrganizerCard key={organizer.id} organizer={organizer} />
                ))
            ) : (
              <p className="text-gray-500 text-center py-4">No organizers found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  trend,
  className = "bg-gray-50 text-gray-600",
}) => (
  <div className={`p-4 rounded-lg ${className}`}>
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-full bg-white">{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        {trend && <p className="text-xs opacity-75">{trend}</p>}
      </div>
    </div>
  </div>
);

const EventCard: React.FC<EventCardProps> = ({ event }) => {

  return (
    <div className="flex items-center justify-between p-3 border-b last:border-b-0">
      <div>
        <h4 className="font-medium">{event.title}</h4>
        <p className="text-sm text-gray-500">
          {new Date(event.date).toLocaleDateString()} • Organized by <b> {event.organizer.name}</b>
        </p>
      </div>
      <div className="flex items-center gap-2">
        {new Date(event.date) > new Date() ? (
          <>
            <span
              className="text-xs px-2 py-1 rounded-full 
                bg-green-100 text-green-800
                "
            >
              Active
            </span>
            <span className="text-sm text-gray-500">
              {isNaN(new Date(event.date).getTime()) ? "Invalid date" : Math.floor((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
            </span>
          </>
        ) : (
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
            Ended
          </span>

        )}
                    <span className="mx-1 text-gray-500">•</span>
        <span className="text-sm text-gray-500">
          Score : {event.score}
        </span>
      </div>
    </div>
  );
};
// Simplified OrganizerCard component
const OrganizerCard: React.FC<OrganizerCardProps> = ({ organizer }) => (
  <div className="flex items-center justify-between p-3 border-b last:border-b-0">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
        {organizer.name?.charAt(0) || "O"}
      </div>
      <div>
        <h4 className="font-medium">{organizer.name || "Organizer"}</h4>
        <p className="text-sm text-gray-500">
          {organizer.eventsOrganized || 0} events organized
        </p>
      </div>
    </div>

  </div>
);
export default AdminDashboard;
