"use client";
import { useActionState } from "react";
import { createTicketGift } from "../../actions/createTicketGift";

const initialState = {
  message: "",
};

const Form = ({
  registryId,
  email,
  userId,
}: {
  registryId: string;
  email: string;
  userId: string;
}) => {
  const [state, formAction, pending] = useActionState(
    createTicketGift,
    initialState
  );
  console.log("🚀 ~ pending:", pending);
  console.log("🚀 ~ state:", state);

  return (
    <form
      action={formAction}
      className="border border-gray-400 p-5 rounded-sm w-1/2 my-5 mx-auto"
    >
      <input
        id="registryId"
        name="registryId"
        defaultValue={registryId}
        className=" hidden"
      />
      <input
        id="userId"
        name="userId"
        defaultValue={userId}
        className=" hidden"
      />
      <div className="mt-4">
        <label htmlFor="email">Email</label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            placeholder="ejemplo@email.com"
            className="border-gray-300 border w-full p-2 rounded-md bg-gray-100 text-gray-500"
            defaultValue={email}
            disabled
          />
        </div>
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
      <button
        type="submit"
        className="w-full rounded-md bg-indigo-600 p-3 font-semibold text-white hover:opacity-75 mt-5"
      >
        {pending ? "Loading..." : " Crear Ticket"}
      </button>
    </form>
  );
};

export default Form;
