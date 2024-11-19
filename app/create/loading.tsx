import React from "react";
import { BiLoaderCircle } from "react-icons/bi";

export default function loading() {
  return (
    <div className="w-full justify-center items-center h-dvh flex">
      <BiLoaderCircle className="animate-spin" />
    </div>
  );
}
