import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  organizerId: number;
  createdAt: string;
  attendees?: any[];
  score: number;
  engagementScore?: number;
}

interface Registration {
  id: number;
  attendee: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
}

const ManageEvents = () => {
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [liveEvents, setLiveEvents] = useState<Event[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAttendeesDialogOpen, setIsAttendeesDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetch("https://eventflow-1wso.onrender.com/api/events/organizer/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setLiveEvents(data.liveEvents))
        .catch((err) => console.error("Error fetching organizer events:", err));
    }
  }, [token]);

  const fetchRegistrations = async (eventId: number) => {
    try {
      const response = await fetch(
        `https://eventflow-1wso.onrender.com/api/registrations/event/${eventId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Failed to fetch attendees");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (event: Event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      location: event.location,
    });
    setIsEditDialogOpen(true);
  };

  const handleViewAttendees = async (event: Event) => {
    setCurrentEvent(event);
    await fetchRegistrations(event.id);
    setIsAttendeesDialogOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (eventId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete || !token) return;

    try {
      await api.deleteEvent(eventId, token);
      setLiveEvents((prev) => prev.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Manage Events</h1>
          <p className="text-gray-600">Create, edit, and manage your events</p>
        </div>
        <div className="flex gap-4 items-center">
          <Input
            type="text"
            placeholder="Search events..."
            className="w-64"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Button
            onClick={() => navigate("/create-event")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            + Create Event
          </Button>
        </div>
      </div>

      {liveEvents.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center">
          <div className="text-4xl mb-4 text-gray-400">📅</div>
          <h2 className="text-lg font-semibold mb-2">
            {liveEvents.length === 0 ? "No events found" : "No matching events"}
          </h2>
          <p className="text-gray-500 mb-4">
            {liveEvents.length === 0
              ? "You haven't created any events yet. Start by creating your first event."
              : "No events match your search criteria."}
          </p>
          <Button
            onClick={() => navigate("/dashboard/create-event")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Create Event
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {liveEvents.map((event) => (
            <div key={event.id} className="p-4 bg-white shadow rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{event.title}</h3>
                  <p className="text-gray-600">{event.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{event.location}</span>
                    <span className="mx-2">•</span>
                    <span>{event.attendees?.length || 0} attendees</span>
                    <span className="mx-2">•</span>
                    <span>Score : {event.score || 0}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleViewAttendees(event)}
                    variant="outline"
                  >
                    View Attendees
                  </Button>
                  <Button
                    onClick={() => handleEditClick(event)}
                    variant="outline"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(event.id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (!token || !currentEvent) return;
            try {
              await api.updateEvent(currentEvent.id, formData, token);
              setLiveEvents((prev) =>
                prev.map((event) =>
                  event.id === currentEvent.id ? { ...event, ...formData } : event
                )
              );
              toast.success("Event updated successfully!");
              setIsEditDialogOpen(false);
            }
            catch (error) {
              console.error("Error updating event:", error);
              toast.error("Failed to update event");
            }
            setIsEditDialogOpen(false);
          }}>
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleFormChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Attendees Dialog */}
      <Dialog
        open={isAttendeesDialogOpen}
        onOpenChange={setIsAttendeesDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Attendees for {currentEvent?.title || "Event"}
            </DialogTitle>
          </DialogHeader>
          {registrations.length > 0 ? (
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registered On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>{registration.attendee.name}</TableCell>
                      <TableCell>{registration.attendee.email}</TableCell>
                      <TableCell>
                        {new Date(registration.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No attendees registered yet</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageEvents;
