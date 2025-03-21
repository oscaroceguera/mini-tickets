import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prismaClient";
import { transporter } from "../../lib/nodemailer";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { toDataURL } from "qrcode";

const endpointSecret = process.env.STRIPE_CHECKOUT_SUCCESS_WEBHOOK_SECRET!;

// type TUser = {
//   fullname?: string;
//   email: string;
//   country?: string;
// };

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error) {
    console.log("ERROR", error);
    // response.status(400).send(`Webhook Error: ${error}`);
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

      const ticketTypeSale = checkoutSessionCompleted.metadata?.ticketTypeSale;

      // ticketTypeSale = NORMAL | GIFT | GROUP
      const order = await prisma.order.create({
        data: {
          checkoutSessionId: checkoutSessionCompleted.id,
          ticketTypeSale: ticketTypeSale as string,
          buyer: checkoutSessionCompleted.customer_details?.email,
        },
      });

      if (ticketTypeSale === "NORMAL") {
        // ticketTypeSale = NORMAL
        const user = await prisma.user.create({
          include: {
            order: true,
          },
          data: {
            fullname: checkoutSessionCompleted.metadata?.fullname,
            email: checkoutSessionCompleted.metadata?.email as string,
            country: checkoutSessionCompleted.metadata?.country,
            order: {
              connect: {
                id: order.id,
              },
            },
          },
        });

        // ticketTypeSale = NORMAL
        const ticket = await prisma.ticket.create({
          include: {
            registration: true,
          },
          data: {
            ticketType: checkoutSessionCompleted.metadata?.ticketType as string,
            user: {
              connect: {
                id: user.id,
              },
            },
            paymenIntent: checkoutSessionCompleted.payment_intent as string,
            paymentId: checkoutSessionCompleted.id,
            order: {
              connect: {
                id: order.id,
              },
            },
            registration: {
              create: {
                event: 2025,
                // TicketTypeSale,  NORMAL = true, GIFT = false, GROUP = false
                // onboarding:
                //   checkoutSessionCompleted.metadata?.ticketTypeSale ===
                //   "NORMAL",
                onboarding: true,
              },
            },
          },
        });

        // ticketTypeSale = NORMAL
        const src = await toDataURL(ticket?.registration?.id);
        const info = await transporter.sendMail({
          from: "Mini-Ticket <admin@miniticket.com>",
          to: user.email,
          subject: "Gracias por tu compra",
          html: `<h1>Hola ${user.fullname}</h1><br /><p>Este es tu ticket:</p><br /><img src="${src}" />`,
        });

        console.log("info =>", info);
      }

      if (ticketTypeSale === "GIFT") {
        console.log("<<<<<<<<<ENTRA EL GIFLT >>>>>>>>>>>>>>>>>>");
        // ticketTypeSale = GIFT
        const user = await prisma.user.create({
          include: {
            order: true,
          },
          data: {
            email: checkoutSessionCompleted.metadata?.email,
            order: {
              connect: {
                id: order.id,
              },
            },
          },
        });

        // ticketTypeSale = GIFT
        const ticket = await prisma.ticket.create({
          include: {
            registration: true,
          },
          data: {
            ticketType: checkoutSessionCompleted.metadata?.ticketType as string,
            user: {
              connect: {
                id: user.id,
              },
            },
            paymenIntent: checkoutSessionCompleted.payment_intent as string,
            paymentId: checkoutSessionCompleted.id,
            order: {
              connect: {
                id: order.id,
              },
            },
            registration: {
              create: {
                event: 2025,
                // TicketTypeSale,  NORMAL = true, GIFT = false, GROUP = false
                onboarding: false,
              },
            },
          },
        });

        // ticketTypeSale = GIFT
        const registrationId = ticket.registration.id;
        const info = await transporter.sendMail({
          from: "Mini-Ticket <admin@miniticket.com>",
          to: user.email,
          subject: "Gracias por tu compra",
          html: `<h1>Hola ${order.buyer} te regala una entrada al evento2025</h1><br /><p>Tu ticket esta casi listo, solo llena tus datos para recibirlo:</p><br /><a href="http://localhost:3000/onboarding/${registrationId}">Onboarding</a>`,
        });

        console.log("info =>", info);
      }

      if (ticketTypeSale === "GROUP") {
        console.log("<<<<<<<<<ENTRA EL GIFLT >>>>>>>>>>>>>>>>>>");
        console.log(
          "checkoutSessionCompleted.metadata",
          checkoutSessionCompleted.metadata
        );

        const emails = checkoutSessionCompleted.metadata?.emails;
        if (!emails) {
          return; // some errors
        }
        const newEmails = JSON.parse(emails);

        newEmails.forEach(async (email: string) => {
          // ADD USER
          const user = await prisma.user.create({
            include: {
              order: true,
            },
            data: {
              email: email,
              order: {
                connect: {
                  id: order.id,
                },
              },
            },
          });

          // ticketTypeSale = GROUP
          const ticket = await prisma.ticket.create({
            include: {
              registration: true,
            },
            data: {
              ticketType: checkoutSessionCompleted.metadata
                ?.ticketType as string,
              user: {
                connect: {
                  id: user.id,
                },
              },
              paymenIntent: checkoutSessionCompleted.payment_intent as string,
              paymentId: checkoutSessionCompleted.id,
              order: {
                connect: {
                  id: order.id,
                },
              },
              registration: {
                create: {
                  event: 2025,
                  // TicketTypeSale,  NORMAL = true, GIFT = false, GROUP = false
                  onboarding: false,
                },
              },
            },
          });

          // ticketTypeSale = GROUP
          const registrationId = ticket.registration.id;
          const info = await transporter.sendMail({
            from: "Mini-Ticket <admin@miniticket.com>",
            to: user.email,
            subject: "Gracias por tu compra",
            html: `<h1>Hola ${order.buyer} te regala una entrada al evento2025</h1><br /><p>Tu ticket esta casi listo, solo llena tus datos para recibirlo:</p><br /><a href="http://localhost:3000/onboarding/${registrationId}">Onboarding</a>`,
          });

          console.log("info =>", info);
        });
      }

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
