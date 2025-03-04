import { prisma } from "../../../lib/prismaClient";

export async function GET() {
  const tickets = await prisma.ticket.findMany({
    include: {
      user: true,
      order: true,
      registration: true,
    },
  });
  return Response.json(tickets);
}
