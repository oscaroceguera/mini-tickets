import { prisma } from "../../../lib/prismaClient";

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      order: true,
      ticket: true,
    },
  });
  return Response.json(users);
}
