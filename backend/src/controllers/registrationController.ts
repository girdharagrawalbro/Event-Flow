import { Request, Response } from "express";
import prisma from "../prisma";
import { calculateEngagementScore } from "../utils/engagementScore";

import { createAuditLog } from "../utils/auditLog";

// route to register for an event
export const registerForEvent = async (req: any, res: Response) => {
  const { eventId } = req.body;

  const exists = await prisma.registration.findFirst({
    where: {
      attendeeId: req.user.userId,
      eventId: eventId,
    },
  });

  if (exists) {
    return res.status(400).json({ message: "Already registered" });
  }

  const registration = await prisma.registration.create({
    data: {
      attendeeId: req.user.userId,
      eventId,
    },
  });
  const score = await calculateEngagementScore(eventId);
  await createAuditLog("REGISTERED_EVENT", req.user.userId);
  console.log("Engagement score updated:", score);
  res.status(201).json(registration);
};

// route for unrgister for an event
export const unregisterFromEvent = async (req: any, res: Response) => {
  const { eventId } = req.body;

  await prisma.registration.deleteMany({
    where: {
      attendeeId: req.user.userId,
      eventId: eventId,
    },
  });
  const score = await calculateEngagementScore(eventId);
  await createAuditLog("UNREGISTERED_EVENT", req.user.userId);
  res.json({ message: "Unregistered from event" });
};

export const getMyRegistrations = async (req: any, res: Response) => {
  const registrations = await prisma.registration.findMany({
    where: { attendeeId: req.user.userId },
    include: {
      event: true,
    },
  });

  res.json(registrations);
};

// route to get all registrations for an event
export const getEventRegistrations = async (req: any, res: Response) => {
  const { id } = req.params;

  const event = await prisma.event.findFirst({
    where: {
      id: parseInt(id),
      organizerId: req.user.userId,
    },
    include: {
      registrations: {
        include: {
          attendee: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found or not yours" });
  }

  res.json(event.registrations);
};
