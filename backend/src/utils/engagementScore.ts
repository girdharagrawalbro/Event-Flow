import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const calculateEngagementScore = async (eventId: number) => {
  const numericEventId = Number(eventId);
  const event = await prisma.event.findUnique({
    where: { id: numericEventId },
    include: {
      registrations: {
        include: {
          attendee: true,
        },
      },
      feedbacks: true,
      organizer: true,
    },
  });

  if (!event) return 0;

  // 1. Number of Registrations (0-2 points)
  const registrationPoints = Math.min(event.registrations.length, 2);

  // 2. Attendance Confirmation Rate (0-2 points)
  const confirmedRegistrations = event.registrations.filter(
    (reg) => reg.confirmed === true
  ).length;
  const attendanceRate =
    event.registrations.length > 0
      ? (confirmedRegistrations / event.registrations.length) * 2
      : 0;
  const attendancePoints = Math.min(Math.round(attendanceRate), 2);

  // 3. Organizer Responsiveness (0-1 point)
  const organizerPoints = event.organizer?.responded ? 1 : 0;

  // 4. Attendee Feedback (0-1 point)
  const feedbackPoints = event.feedbacks.length > 0 ? 1 : 0;

  // Final Engagement Score Calculation
  const totalScore =
    registrationPoints + attendancePoints + organizerPoints + feedbackPoints;

  // Update the score in the event table
  await prisma.event.update({
    where: { id: numericEventId },
    data: { score: totalScore },
  });

  return totalScore;
};
