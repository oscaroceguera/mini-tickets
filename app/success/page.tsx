"use client";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

function Success() {
  const { width, height } = useWindowSize();
  return (
    <>
      <div className="w-[100vw] h-[100vh] flex flex-col justify-center">
        <Confetti width={width} height={height} />
        <h1 className="font-black text-center text-9xl">Success!!!</h1>
      </div>
    </>
  );
}

export default Success;
