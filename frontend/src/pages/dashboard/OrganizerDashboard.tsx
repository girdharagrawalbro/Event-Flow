// OrganizerDashboard.tsx
import { useEffect, useState } from "react";
import StatCard from "@/components/ui/stat-card";
import { CalendarDays } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

interface OrganizerEvents {
  allEvents?: Event[];
  completedEvents?: Event[];
}

const OrganizerDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [orgnizerevents, setOrganizer] = useState<OrganizerEvents>({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch all events
    fetch("https://eventflow-1wso.onrender.com/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));

    // Fetch organizer's events
    if (token) {
      fetch("https://eventflow-1wso.onrender.com/api/events/organizer/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setOrganizer(data))
        .catch((err) => console.error("Error fetching organizer events:", err));
    }
  }, [token]);

  return (
    <div className="p-2 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Organizer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatCard
          icon={<CalendarDays className="text-black-500 w-6 h-6" />}
          title="Total Events"
          value={orgnizerevents.allEvents?.length || 0}
        />
            <StatCard
          icon={<CalendarDays className="text-black-500 w-6 h-6" />}
          title="Upcoming Events"
          value={orgnizerevents.completedEvents?.length || 0}
        />
            

      </div>

      {events.length === 0 ? (
        <p className="text-gray-500">No recent events found.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li
              key={event.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="text-md font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()} • {event.location}  
                  {new Date(event.date) > new Date() ? (
                    <span className="text-green-500 ml-2">• Upcoming</span>
                  ) : (
                    <span className="text-gray-500 ml-2">• Completed</span>
                  )}
                </p>
              </div>
              <div className="mr-10">
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrganizerDashboard;
