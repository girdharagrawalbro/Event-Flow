import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import toast from "react-hot-toast";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      // Format the date and time into ISO string
      const eventDateTime = new Date(`${formData.date}`).toISOString();

      const data = {
        title: formData.title,
        description: formData.description,
        date: eventDateTime,
        location: formData.location,
      };

      const response = await api.createEvent(data, token);

      if (response.error) {
        throw new Error(response.error);
      }

      toast.success("Event created successfully!");
      navigate("/dashboard/home"); // Redirect to organizer dashboard
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
      console.error("Create event error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-1">Create New Event</h1>
      <p className="text-sm text-gray-500 mb-6">
        Fill in the details to create a new event
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-1">Event Details</h2>
        <p className="text-sm text-gray-500 mb-6">
          Provide all the necessary information about your event
        </p>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          {/* Event Name */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Event Name*
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Tech Conference 2023"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date and Time */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Date*</label>
            <input
              type="date"
              name="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]} // Prevent past dates
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium mb-1">Time*</label>
            <input
              type="time"
              name="time"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div> */}

          {/* Location */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Location*</label>
            <input
              type="text"
              name="location"
              placeholder="Venue or Online"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description*
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe your event..."
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          {/* 
          {/* Category
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Tech">Tech</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Music">Music</option>
            </select>
          </div>

          {/* Capacity */}
          {/* <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.capacity}
              onChange={handleChange}
            />
          </div> */}

          {/* Image URL */}
          {/* <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Event Image URL</label>
            <input
              type="url"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div> */}

          {/* Submit Button */}
          <div className="col-span-2 flex justify-between items-center">
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
