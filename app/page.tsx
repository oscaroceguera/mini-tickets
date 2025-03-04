"use client";

import Link from "next/link";
import { checkout } from "./actions/checkout";
import { useActionState } from "react";

type TicketType = "EARLY" | "STUDENT";

type Ticket = {
  name: TicketType;
  price: number;
};

const tickets: Ticket[] = [
  {
    name: "EARLY",
    price: 1300,
  },
  {
    name: "STUDENT",
    price: 800,
  },
];

const initialState = {
  message: "",
};

export default function Home() {
  const [state, formAction, pending] = useActionState(checkout, initialState);
  console.log("🚀 ~ Home ~ state:", state);
  return (
    <div className="h-screen p-28">
      <h1 className="font-black text-4xl text-center">Buy tickets</h1>
      <div className="m-auto w-1/2 mt-5 grid grid-cols-2 gap-1">
        <Link
          href={"/"}
          className="bg-pink-400 text-center py-2 text-white font-semibold rounded-sm hover:opacity-80"
        >
          Ticket de regalo
        </Link>
        <Link
          href={"/"}
          className="bg-orange-400 text-center py-2 text-white font-semibold rounded-sm hover:opacity-80"
        >
          Tickets por grupo
        </Link>
      </div>
      <form
        action={formAction}
        className="border border-gray-400 p-5 rounded-sm w-1/2 my-5 mx-auto"
      >
        <label htmlFor="ticketType" className="text-lg font-semibold">
          Seleccione ticket
        </label>
        <div className="mt-2">
          <select
            className="w-full rounded-md border-gray-300 p-2 outline-2 placeholder:text-green-500"
            id="ticketType"
            name="ticketType"
          >
            {tickets.map((ticket: Ticket) => (
              <option key={ticket.name} value={ticket.name}>
                {ticket.name} - ${ticket.price} MXN
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label htmlFor="fullname">
            Nombre completo <span className="text-red-600">*</span>
          </label>
          <div className="mt-2">
            <input
              id="fullname"
              name="fullname"
              placeholder="Nombre completo"
              className="border-gray-300 border w-full p-2 rounded-md"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="email">
            Email <span className="text-red-600">*</span>
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              placeholder="ejemplo@email.com"
              className="border-gray-300 border w-full p-2 rounded-md"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="country">País</label>
          <div className="mt-2">
            <input
              id="country"
              name="country"
              placeholder="México"
              className="border-gray-300 border w-full p-2 rounded-md"
            />
          </div>
        </div>
        <input
          id="ticketTypeSale"
          name="ticketTypeSale"
          defaultValue="NORMAL"
          className=" hidden"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 p-3 font-semibold text-white hover:opacity-75 mt-5"
        >
          {pending ? "Loading..." : "Checkout"}
        </button>
      </form>
    </div>
  );
}
