import { prisma } from "../../lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const user = await prisma.user.create({
    include: {
      order: true,
    },
    data: {
      fullname: "Fullname",
      email: "email3",
      country: "country",
      order: {
        create: {
          checkoutSessionId: "a8be5f52-a7c8-4fd8-bd44-cbb9d7435605",
          ticketTypeSale: "NORMAL",
          buyer: "buyer@email.com",
        },
      },
    },
  });

  console.log("[USER]", user);

  const ticket = await prisma.ticket.create({
    data: {
      ticketType: "EARLY-BIRD",
      user: {
        connect: {
          id: user.id,
        },
      },
      paymenIntent: "payment_intent",
      paymentId: "a8be5f52-a7c8-4fd8-bd44-cbb9d7435605",
      order: {
        connect: {
          id: user.order.id,
        },
      },
      registration: {
        create: {
          event: 2025,
        },
      },
    },
  });

  console.log("[TICKET]", ticket);

  return new Response(null, { status: 200 });
}
