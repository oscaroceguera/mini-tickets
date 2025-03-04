import { prisma } from "../../../lib/prismaClient";

export async function GET() {
  const registrations = await prisma.registrationSheet.findMany({
    include: {
      ticket: {
        include: {
          user: true,
          order: true,
        },
      },
    },
  });
  return Response.json(registrations);
}
