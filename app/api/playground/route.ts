import { prisma } from "../../lib/prismaClient";

const CHECKOUT_ID = "ab903018-8999-40dd-830e-8ec7c9ad757a";
const PAYMENT_INTENT = "b50a684c-0170-4082-9e75-b3b8d7f7739e";
const PAYMENT_ID = "28996160-0413-4a35-9f64-b97e84ff14bc";

export async function POST() {
  const order = await prisma.order.create({
    data: {
      checkoutSessionId: CHECKOUT_ID,
      ticketTypeSale: "NORMAL",
      buyer: "buyer@email.com",
    },
  });
  const user1 = await prisma.user.create({
    data: {
      fullname: "Fullname TRES",
      email: "emailTres",
      country: "country",
      order: {
        connect: {
          id: order.id,
        },
      },
    },
  });
  const user2 = await prisma.user.create({
    data: {
      fullname: "Fullname CUATRO",
      email: "emailCuatro",
      country: "country",
      order: {
        connect: {
          id: order.id,
        },
      },
    },
  });
  const user3 = await prisma.user.create({
    data: {
      fullname: "Fullname CINCO",
      email: "emailCinco",
      country: "country",
      order: {
        connect: {
          id: order.id,
        },
      },
    },
  });

  const ticket1 = await prisma.ticket.create({
    data: {
      ticketType: "EARLY-BIRD",
      user: {
        connect: {
          id: user1.id,
        },
      },
      paymenIntent: PAYMENT_INTENT,
      paymentId: PAYMENT_ID,
      order: {
        connect: {
          id: order.id,
        },
      },
      registration: {
        create: {
          event: 2025,
        },
      },
    },
  });
  console.log("🚀 ~ POST ~ ticket1:", ticket1);
  const ticket2 = await prisma.ticket.create({
    data: {
      ticketType: "STUDENT",
      user: {
        connect: {
          id: user2.id,
        },
      },
      paymenIntent: PAYMENT_INTENT,
      paymentId: PAYMENT_ID,
      order: {
        connect: {
          id: order.id,
        },
      },
      registration: {
        create: {
          event: 2025,
        },
      },
    },
  });
  console.log("🚀 ~ POST ~ ticket2:", ticket2);
  const ticket3 = await prisma.ticket.create({
    data: {
      ticketType: "FASE 1",
      user: {
        connect: {
          id: user3.id,
        },
      },
      paymenIntent: PAYMENT_INTENT,
      paymentId: PAYMENT_ID,
      order: {
        connect: {
          id: order.id,
        },
      },
      registration: {
        create: {
          event: 2025,
        },
      },
    },
  });
  console.log("🚀 ~ POST ~ ticket3:", ticket3);

  return new Response(null, { status: 200 });
}
