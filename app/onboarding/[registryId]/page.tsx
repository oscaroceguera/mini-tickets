import { prisma } from "../../lib/prismaClient";
import Form from "./form";

async function Onboarding({
  params,
}: {
  params: Promise<{ registryId: string }>;
}) {
  const { registryId } = await params;

  const registry = await prisma.RegistrationSheet.findFirst({
    include: {
      ticket: {
        include: {
          user: true,
        },
      },
    },
    where: {
      id: registryId,
    },
  });

  if (!registry) {
    return <h1>No existe registro</h1>;
  }

  if (registry.onboarding) {
    return <h1>EL ticket ya fue registrado</h1>;
  }

  console.log("🚀 ~ registry:", registry);

  return (
    <div className="h-screen p-28">
      <h1 className="font-black text-4xl text-center">Onboarding</h1>
      <div className="m-auto w-1/2 mt-5 grid grid-cols-2 gap-1">
        <p>Ticket type: {registry.ticket.ticketType}</p>
      </div>
      <Form
        registryId={registry.id}
        userId={registry.ticket.user.id}
        email={registry.ticket.user.email}
      />
    </div>
  );
}

export default Onboarding;
