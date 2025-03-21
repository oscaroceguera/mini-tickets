"use server";

import { redirect } from "next/navigation";
import { stripe } from "../lib/stripe";

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

export async function checkoutGroup(_prevstate: State, formData: FormData) {
  // Validate users exists: _: continue; X: return error;

  console.log("FORM-DATA entra", formData);

  // // Validate if user exist
  // const userVerify = await prisma.user.findFirst({
  //   where: {
  //     email: formData.get("email") as string,
  //   },
  // });
  // if (userVerify) {
  //   return {
  //     message: "El usuario ya fue registrado",
  //   };
  // }
  //  Stripe checkout-session
  const ticketType = formData.get("ticketType") as string;
  const ticketTypeSale = formData.get("ticketTypeSale") as string; // GROUP
  const emails = [
    formData.get("email1") as string,
    formData.get("email2") as string,
    formData.get("email3") as string,
    formData.get("email4") as string,
  ];
  const newEmails = JSON.stringify(emails);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: STRIPE_PRICE_ID[ticketType as keyof PriceID],
        quantity: 4, // TODO: Este seria dinamico por los grupos, por default es 1
      },
    ],
    metadata: {
      ticketType: ticketType,
      emails: newEmails,
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
