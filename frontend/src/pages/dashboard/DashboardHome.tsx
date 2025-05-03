import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import StatCard from "@/components/ui/stat-card";
import { CalendarDays, CheckCircle, CheckCircle2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

const DashboardHome = () => {
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [liveEvents, setLiveEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://eventflow-1wso.onrender.com/api/events"
        );
        const data = await response.json();
        const response2 = await fetch(
          "https://eventflow-1wso.onrender.com/api/events/attendee/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data2 = await response2.json();
        setLiveEvents(data);
        setRegisteredEvents(data2.registeredEvents || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleunRegisterClick = async (eventId: string) => {
    try {
      const res = await fetch(
        "https://eventflow-1wso.onrender.com/api/registrations/unregister",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            eventId: eventId,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to unregister for event");
      }

      toast.success("Unregistered Successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error unregistering for event:", error);
      toast.error("Error unregistering for event.");
    }
  };

  interface RegisterFormProps {
    event: Event;
    onRegisterSuccess?: () => void;
  }

  const RegisterForm: React.FC<RegisterFormProps> = ({
    event,
    onRegisterSuccess,
  }) => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "https://eventflow-1wso.onrender.com/api/registrations/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              eventId: event.id,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to register for event");
        }

        toast.success("Registered Successfully");
        onRegisterSuccess?.();
        window.location.reload();
      } catch (error) {
        console.error("Error registering for event:", error);
        toast.error("Error registering for event.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="p-6 max-w-lg mx-auto w-full bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-2">Event Title</label>
            <input
              type="text"
              value={event.title}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Event Date</label>
            <input
              type="text"
              value={event.date}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Location</label>
            <input
              type="text"
              value={event.location}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 p-6">
       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {"User"}!</h1>
          <p className="text-muted-foreground text-sm">
            Here's what's happening with your events
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<CalendarDays className="text-black-500 w-6 h-6" />}
          title="Upcoming Events"
          value={liveEvents.length}
        />

        <StatCard
          icon={<CheckCircle2 className="text-green-500 w-6 h-6" />}
          title="Registered Events"
          value={registeredEvents.length}
        />

        <StatCard
          icon={<CheckCircle className="text-red-500 w-6 h-6" />}
          title="Completed Events"
          value={registeredEvents.filter((event) => new Date(event.date).getTime() < Date.now()).length}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
        <div className="bg-white rounded-lg shadow p-4">
          {liveEvents.length === 0 ? (
            <p className="text-muted-foreground">No upcoming events found</p>
          ) : (
            liveEvents.map((event) => (
              <div
                key={event.id}
                className={`py-2 px-4 border-b last:border-none flex justify-between items-center ${
                  registeredEvents.some((regEvent) => regEvent.id === event.id)
                    ? "bg-green-50"
                    : ""
                }`}
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    {registeredEvents.some(
                      (regEvent) => regEvent.id === event.id
                    ) ? (
                      <button
                        onClick={() => handleunRegisterClick(event.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Unregister
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegisterClick(event)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Register
                      </button>
                    )}
                  </DialogTrigger>
                  {selectedEvent && (
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Register for Event</DialogTitle>
                        <DialogDescription>
                          Please fill in the registration form for the event{" "}
                          {selectedEvent.title}.
                        </DialogDescription>
                      </DialogHeader>
                      <RegisterForm
                        event={selectedEvent}
                        onRegisterSuccess={() => setSelectedEvent(null)}
                      />
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
