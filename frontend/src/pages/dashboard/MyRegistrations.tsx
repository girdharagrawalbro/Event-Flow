"use client";

import { useEffect, useState } from "react";
import { CalendarX } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyRegistrations() {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming you're storing JWT here
        const res = await fetch(
          "https://eventflow-1wso.onrender.com/api/events/attendee/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch registrations");
        }

        const data = await res.json();
        setRegisteredEvents(data.registeredEvents);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Registrations</h1>
        <p className="text-muted-foreground">Events you've registered for</p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : registeredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 bg-white rounded-lg py-16 shadow-sm">
          <CalendarX className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold">No registrations found</h2>
          <p className="text-sm text-muted-foreground mb-4">
            You haven't registered for any events yet.
          </p>
          <Link to="/events">
            <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-md">
              Browse Events
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {registeredEvents.map((event: {
            registered_at: string | number | Date; id: string; title: string; date: string 
}) => (
            <div key={event.id} className="p-4 bg-white shadow rounded-lg">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-muted-foreground">{event.date}</p>
              <p className="text-xs text-gray-500">
                Registered on:{" "}
                {new Date(event.registered_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
