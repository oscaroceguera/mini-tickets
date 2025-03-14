"use server";

import { redirect } from "next/navigation";
import { prisma } from "../lib/prismaClient";
import { transporter } from "../lib/nodemailer";
import { toDataURL } from "qrcode";

type State = {
  message?: string;
};

export async function createTicketGift(_prevstate: State, formData: FormData) {
  console.log("🚀 ~ createTicketGift ~ formData:", formData);

  // Validate if onboarding is false and exist
  const registry = await prisma.RegistrationSheet.findFirst({
    where: {
      id: formData.get("registryId") as string,
    },
  });

  console.log("🚀 ~ createTicketGift ~ registry:", registry);

  if (!registry) {
    return {
      message: "No existe registro",
    };
  }

  if (registry.onboarding) {
    return {
      message: "EL ticket ya fue registrado",
    };
  }

  // Update User
  const user = await prisma.user.update({
    where: {
      id: formData.get("userId") as string,
    },
    data: {
      fullname: formData.get("fullname") as string,
      country: formData.get("country") as string,
    },
  });
  console.log("=====> [UPDATE]: USER");

  // Update regisrty onboarding = true
  const newRegistry = await prisma.RegistrationSheet.update({
    where: {
      id: formData.get("registryId") as string,
    },
    data: {
      onboarding: true,
    },
  });
  console.log("=====> [UPDATE]: REGISTRY");

  const src = await toDataURL(newRegistry.id);
  const info = await transporter.sendMail({
    from: "Mini-Ticket <admin@miniticket.com>",
    to: user.email,
    subject: "Gracias por tu compra",
    html: `<h1>Hola ${user.fullname}</h1><br /><p>Este es tu ticket:</p><br /><img src="${src}" />`,
  });

  console.log("======> [INFO-EMAIL]", info);
  redirect("/success");

  return {
    message: "",
  };
}
