import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prismaClient";
import { transporter } from "../../lib/nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { toDataURL } from "qrcode";

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

      const order = await prisma.order.create({
        data: {
          checkoutSessionId: checkoutSessionCompleted.id,
          ticketTypeSale: checkoutSessionCompleted.metadata?.ticketTypeSale,
          buyer: checkoutSessionCompleted.customer_details?.email,
        },
      });

      const user = await prisma.user.create({
        include: {
          order: true,
        },
        data: {
          fullname: checkoutSessionCompleted.metadata?.fullname,
          email: checkoutSessionCompleted.metadata?.email,
          country: checkoutSessionCompleted.metadata?.country,
          order: {
            connect: {
              id: order.id,
            },
          },
        },
      });

      const ticket = await prisma.ticket.create({
        include: {
          registration: true,
        },
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
          registration: {
            create: {
              event: 2025,
            },
          },
        },
      });

      const src = await toDataURL(ticket.registration.id);
      const info = await transporter.sendMail({
        from: "Mini-Ticket <admin@miniticket.com>",
        to: user.email,
        subject: "Gracias por tu compra",
        html: `<h1>Hola ${user.fullname}</h1><br /><p>Este es tu ticket:</p><br /><img src="${src}" />`,
      });

      console.log("info =>", info);

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
