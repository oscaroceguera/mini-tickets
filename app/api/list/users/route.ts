import { prisma } from "../../../lib/prismaClient";

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      // user: true,
      order: true,
      ticket: true,
      // registration: true,
    },
  });
  return Response.json(users);
}
