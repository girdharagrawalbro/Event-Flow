import { Request, Response } from "express";
import prisma from "../prisma";
import { calculateEngagementScore } from "../utils/engagementScore";
import { createAuditLog } from "../utils/auditLog";

// route to crate events
export const createEvent = async (req: any, res: Response) => {
  const { title, description, date, location, organizer, email } = req.body;

  const event = await prisma.event.create({
    data: {
      title,
      description,
      date: new Date(date),
      location,
      organizerId: req.user.userId,
    },
  });
  console.log(event);
  const score = await calculateEngagementScore(event.id);
  await createAuditLog("CREATE_EVENT", req.user.userId);
  // Broadcast the new event to all connected clients
  req.io.emit("event_created", event);
  console.log("Engagement Score:", score);
  res.status(201).json(event);
};

// route to get all events
export const getAllEvents = async (req: Request, res: Response) => {
  const events = await prisma.event.findMany({
    include: {
      organizer: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
  res.json(events);
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        createdAt: "desc", // Optional: order by creation date
      },
    });

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  } finally {
    await prisma.$disconnect();
  }
};

// route to update an event
export const updateEvent = async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, description, date, location } = req.body;
  const numericEventId = Number(id);

  const event = await prisma.event.updateMany({
    where: {
      id: numericEventId,
      organizerId: req.user.userId,
    },
    data: {
      title,
      description,
      date: new Date(date),
      location,
    },
  });
  await createAuditLog("EVENT_UPDATE", req.user.userId);
  // Broadcast the updated event to all connected clients
  req.io.emit("event_updated",{ title: title, date: date });

  const score = await calculateEngagementScore(id);
  console.log("Engagement Score:", score);
  res.json({ message: "Event updated", event });
};

// route to delete an event
export const deleteEvent = async (req: any, res: Response) => {
  const { id } = req.params;
  const numericEventId = Number(id);

  const event = await prisma.event.deleteMany({
    where: {
      id: numericEventId,
      organizerId: req.user.userId,
    },
  });
  await createAuditLog("EVENT_DELETED", req.user.userId);
  const score = await calculateEngagementScore(id);
  console.log("Engagement Score:", score);
  // Broadcast the deleted event ID to all connected clients
  req.io.emit("event_deleted", req.params.id);
  console.log("Engagement Score:", score);
  res.json({ message: "Event deleted" });
};

// get organizer events
export const getOrganizerEvents = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;

    const liveEvents = await prisma.event.findMany({
      where: {
        organizerId: userId,
        date: {
          gte: new Date(), // upcoming/future events
        },
      },
      orderBy: { date: "asc" },
    });

    const completedEvents = await prisma.event.findMany({
      where: {
        organizerId: userId,
        date: {
          lt: new Date(), // past events
        },
      },
      orderBy: { date: "desc" },
    });

    const allEvents = [...liveEvents, ...completedEvents];

    res.json({ liveEvents, completedEvents, allEvents });
  } catch (err) {
    console.error("Error fetching organizer events:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// route to get attendee registered events
export const getAttendeeRegisteredEvents = async (req: any, res: Response) => {
  try {
    const attendeeId = req.user.userId;

    const registrations = await prisma.registration.findMany({
      where: { attendeeId },
      include: {
        event: true, // include event details
      },
    });

    const registeredEvents = registrations.map((reg) => reg.event);

    res.json({ registeredEvents });
  } catch (err) {
    console.error("Error fetching attendee events:", err);
    res.status(500).json({ message: "Failed to fetch registered events" });
  }
};
