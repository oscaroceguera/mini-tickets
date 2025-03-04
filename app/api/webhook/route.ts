import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { connect } from "http2";

const endpointSecret = process.env.STRIPE_CHECKOUT_SUCCESS_WEBHOOK_SECRET!;

// TODO: maybe crear un nuevo hook para gift
// TODO: maybe crear un nuevo hook para grupos
export async function POST(request: NextRequest, response: NextResponse) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error) {
    console.log("ERROR", error);
    response.status(400).send(`Webhook Error: ${error}`);
    return;
  }

  console.log("event ==>", event);
  switch (event.type) {
    case "checkout.session.async_payment_failed":
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      console.log("FAIL =>", checkoutSessionAsyncPaymentFailed);
      // Then define and call a function to handle the event checkout session.async_payment_failed
      break;
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      console.log(
        "🚀 ~ POST ~ checkoutSessionCompleted:",
        checkoutSessionCompleted
      );

      const user = await prisma.user.create({
        data: {
          fullname: checkoutSessionCompleted.metadata?.fullname,
          email: checkoutSessionCompleted.metadata?.email,
          country: checkoutSessionCompleted.metadata?.country,
        },
      });

      const order = await prisma.order.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          checkoutSessionId: checkoutSessionCompleted.id,
          ticketTypeSale: checkoutSessionCompleted.metadata?.ticketTypeSale,
          buyer: checkoutSessionCompleted.customer_details?.email,
        },
      });

      const ticket = await prisma.ticket.create({
        data: {
          ticketType: checkoutSessionCompleted.metadata?.ticketType,
          user: {
            connect: {
              id: user.id,
            },
          },
          paymenIntent: checkoutSessionCompleted.payment_intent,
          paymentId: checkoutSessionCompleted.id,
          order: {
            connect: {
              id: order.id,
            },
          },
        },
      });

      const registration = await prisma.registrationSheet.create({
        data: {
          ticket: {
            connect: {
              id: ticket.id,
            },
          },
        },
      });

      console.log("[registration]:", registration);

      // TODO: Se puede crear una tabla para checking de asistentes y ese id usar para esta puede ir en la misma consulta de creacion del ticket

      // TODO: ENVIAR EMAIL con QR

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
