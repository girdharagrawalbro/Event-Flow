import express from "express";
import {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getAttendeeRegisteredEvents,
  getAllUsers,
} from "../controllers/eventController";
import { protect, organizerOnly } from "../middleware/authMiddleware";

const router = express.Router();

// route bindings
router.get("/", getAllEvents);
router.get("/users", getAllUsers);
router.post("/", protect, organizerOnly, createEvent);
router.put("/:id", protect, organizerOnly, updateEvent);
router.delete("/:id", protect, organizerOnly, deleteEvent);

router.get("/organizer/events", protect, getOrganizerEvents);
router.get("/attendee/events", protect, getAttendeeRegisteredEvents);

export default router;
