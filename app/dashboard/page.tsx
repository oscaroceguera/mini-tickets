import { prisma } from "../lib/prismaClient";

interface Registration {
  onboarding: boolean;
  registeredDay1: boolean;
  registeredDay2: boolean;
}

interface Ticket {
  ticketType: string;
}

interface Order {
  ticketTypeSale: string;
}

async function Dasboard() {
  const users = await prisma.user.findMany();
  const orders = await prisma.order.findMany();
  const tickets = await prisma.ticket.findMany();
  const registrations = await prisma.registrationSheet.findMany();

  const onboardingCompleted = registrations.filter(
    (i: Registration) => i.onboarding === true
  ).length;
  const countRegisteredDay1 = registrations.filter(
    (i: Registration) => i.registeredDay1 === true
  ).length;
  const countRegisteredDay2 = registrations.filter(
    (i: Registration) => i.registeredDay2 === true
  ).length;
  const eatylTickets = tickets.filter(
    (i: Ticket) => i.ticketType === "EARLY"
  ).length;
  const stundentTickets = tickets.filter(
    (i: Ticket) => i.ticketType === "STUDENT"
  ).length;
  const normalOrders = orders.filter(
    (i: Order) => i.ticketTypeSale === "NORMAL"
  ).length;
  const giftOrders = orders.filter(
    (i: Order) => i.ticketTypeSale === "GIFT"
  ).length;
  const groupOrders = orders.filter(
    (i: Order) => i.ticketTypeSale === "GROUP"
  ).length;

  return (
    <div className="h-screen p-4 md:p-24">
      <h1 className="font-black text-3xl mb-6">Dashboard</h1>
      <div className="grid gap-1 md:grid-cols-4 md:gap-4">
        <div className="bg-slate-900 rounded-sm p-2">
          <h3 className="text-white font-bold text-2xl">
            Users: {users.length}
          </h3>
          <p className="text-white text-sm">
            Onboarding completed: <b>{onboardingCompleted}</b>
          </p>
        </div>
        <div className="bg-indigo-500 rounded-sm p-2">
          <h3 className="text-white font-bold text-2xl">
            Orders: {orders.length}
          </h3>
          <p className="text-white text-sm">
            Normal: <b>{normalOrders}</b>
          </p>
          <p className="text-white text-sm">
            Gift: <b>{giftOrders}</b>
          </p>
          <p className="text-white text-sm">
            Group: <b>{groupOrders}</b>
          </p>
        </div>
        <div className="bg-lime-700 rounded-sm p-2">
          <h3 className="text-white font-bold text-2xl">
            Tickets sold: {tickets.length}
          </h3>
          <p className="text-white text-sm">
            Student: <b>{stundentTickets}</b>
          </p>
          <p className="text-white text-sm">
            Early: <b>{eatylTickets}</b>
          </p>
        </div>
        <div className="bg-orange-500 rounded-sm p-2">
          <h3 className="text-white font-bold text-2xl">
            Registry: {registrations.length}
          </h3>
          <p className="text-white text-sm">
            First Day: <b>{countRegisteredDay1}</b>
          </p>
          <p className="text-white text-sm">
            Second Day: <b>{countRegisteredDay2}</b>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dasboard;
