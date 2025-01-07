import React from "react";
import { useParams } from "react-router-dom";
import Message from "./Message";
import { TextBar } from "../my-components/TextBar";

export const Content = () => {
  const { id } = useParams();
  return (
    <div className="h-[80%] w-[82%]">
      <section className="h-[96%] flex-col pt-2">
        <div className="flex flex-col">
          <Message position={"left"} message={"Ahoj"} />
        </div>
      </section>
      <TextBar />
    </div>
  );
};
