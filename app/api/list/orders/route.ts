import { prisma } from "../../../lib/prismaClient";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      // user: true,
      tickets: true,
    },
  });
  return Response.json(orders);
}
