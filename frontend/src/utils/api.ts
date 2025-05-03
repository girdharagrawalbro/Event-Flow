// const BASE_URL = "https://eventflow-1wso.onrender.com/api";
const BASE_URL = "https://eventflow-1wso.onrender.com/api";
import axios from "axios";
export const api = {
  login: (data: any) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  register: (data: any) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  getEvents: () =>
    fetch(`${BASE_URL}/events`, {
      method: "GET",
    }).then((res) => res.json()),

  createEvent: (data: any, token: string) =>
    fetch(`${BASE_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  registerEvent: (eventId: string, token: string) =>
    fetch(`${BASE_URL}/registrations/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    }).then((res) => res.json()),

  unregisterEvent: (eventId: string, token: string) =>
    fetch(`${BASE_URL}/registrations/unregister`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    }).then((res) => res.json()),

  getMyRegistrations: (token: string) =>
    fetch(`${BASE_URL}/registrations/my`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json()),

  getAttendeesForEvent: (eventId: string, token: string) =>
    fetch(`${BASE_URL}/registrations/event/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json()),

  getOrganizerEvents: (token: string) => {
    fetch("https://eventflow-1wso.onrender.com/api/events/organizer/events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateEvent: async (eventId: number, data: any, token: string) => {
    try {
      const response = await axios.put(`${BASE_URL}/events/${eventId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        response,
      };
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (eventId: number, token: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  // Get engagement score (optional, if you want to fetch it separately)
  getEngagementScore: async (eventId: number, token: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/events/${eventId}/engagement`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.score;
    } catch (error) {
      console.error("Error fetching engagement score:", error);
      throw error;
    }
  },

  getAllUsers: (token: string) =>
    fetch(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
      method: "GET",
    }),
  getAllEvents: (token: string) =>
    fetch(`${BASE_URL}/admin/events`, {
      headers: { Authorization: `Bearer ${token}` },
      method: "GET",
    }),
  getAuditLogs: (token: string) =>
    fetch(`${BASE_URL}/auth/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json()),
};
