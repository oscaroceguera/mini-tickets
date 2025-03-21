"use client";

// import Link from "next/link";
import { checkoutGroup } from "../actions/checkoutGroup";
import { useActionState } from "react";

// type TicketType = "EARLY" | "STUDENT";

// type Ticket = {
//   name: TicketType;
//   price: number;
// };

// const tickets: Ticket[] = [
//   {
//     name: "EARLY",
//     price: 1300,
//   },
//   {
//     name: "STUDENT",
//     price: 800,
//   },
// ];

const initialState = {
  message: "",
};

export default function Home() {
  const [state, formAction, pending] = useActionState(
    checkoutGroup,
    initialState
  );
  console.log("🚀 ~ Home ~ state:", state);
  return (
    <div className="h-screen p-28">
      <h1 className="font-black text-4xl text-center">GROUP tickets</h1>

      <form
        action={formAction}
        className="border border-gray-400 p-5 rounded-sm w-1/2 my-5 mx-auto"
      >
        <div className="mt-4">
          <label htmlFor="email1">
            Email 1 <span className="text-red-600">*</span>
          </label>
          <div className="mt-2">
            <input
              id="email1"
              name="email1"
              placeholder="ejemplo@email.com"
              className="border-gray-300 border w-full p-2 rounded-md"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="email2">
            Emai 2l <span className="text-red-600">*</span>
          </label>
          <div className="mt-2">
            <input
              id="email2"
              name="email2"
              placeholder="ejemplo@email.com"
              className="border-gray-300 border w-full p-2 rounded-md"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="email3">
            Email 3 <span className="text-red-600">*</span>
          </label>
          <div className="mt-2">
            <input
              id="email3"
              name="email3"
              placeholder="ejemplo@email.com"
              className="border-gray-300 border w-full p-2 rounded-md"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="email4">
            Email 4 <span className="text-red-600">*</span>
          </label>
          <div className="mt-2">
            <input
              id="email4"
              name="email4"
              placeholder="ejemplo@email.com"
              className="border-gray-300 border w-full p-2 rounded-md"
            />
          </div>
        </div>
        <input
          id="ticketType"
          name="ticketType"
          defaultValue="EARLY"
          className=" hidden"
        />
        <input
          id="ticketTypeSale"
          name="ticketTypeSale"
          defaultValue="GROUP"
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
