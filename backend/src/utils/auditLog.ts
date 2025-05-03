// route to create audit logs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAuditLog = async (action: string, userId: number) => {
  console.log("Creating audit log", action, userId);
  // Check if the userId is valid
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }
  // Create the audit log entry
  await prisma.auditLog.create({
    data: {
      action,
      userId,
    },
  });
};
