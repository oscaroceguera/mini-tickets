"use server";

import { redirect } from "next/navigation";
import { stripe } from "../lib/stripe";
import { prisma } from "../lib/prismaClient";

type State = {
  message?: string;
};

type AllowedTypePrice = "EARLY" | "STUDENT";

type PriceID = {
  [key in AllowedTypePrice]: string;
};

const STRIPE_PRICE_ID: PriceID = {
  EARLY: process.env.STRIPE_PRICE_EARLY!,
  STUDENT: process.env.STRIPE_PRICE_STUDENT!,
};

// TODO: maybe crear un action para gift
// TODO: maybe crear un action para group
export async function checkout(_prevstate: State, formData: FormData) {
  // Validate if user exist
  const userVerify = await prisma.user.findFirst({
    where: {
      email: formData.get("email") as string,
    },
  });

  if (userVerify) {
    return {
      message: "El usuario ya fue registrado",
    };
  }

  //  Stripe checkout-session
  const ticketType = formData.get("ticketType") as string;
  const ticketTypeSale = formData.get("ticketTypeSale") as string;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: STRIPE_PRICE_ID[ticketType as keyof PriceID],
        quantity: 1, // TODO: Este seria dinamico por los grupos, por default es 1
      },
    ],
    metadata: {
      ticketType: ticketType,
      fullname: formData.get("fullname") as string,
      email: formData.get("email") as string,
      country: formData.get("country") as string,
      ticketTypeSale: ticketTypeSale,
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000",
  });

  if (!session) {
    throw new Error("Error creating checkout session");
  }

  if (session.url) {
    redirect(session.url);
  }
  return {
    message: "",
  };
}
