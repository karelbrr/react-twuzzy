import { Content } from "./Content";
import { SideBar } from "./SideBar";
import { TextBar } from "./TextBar";
import { UpperBar } from "./UpperBar";

export const HomePage = () => {
  return (
    <div className="h-screen ">
      <SideBar />
      <div className="flex flex-col items-end h-screen">
        <UpperBar />
        <Content />

        <TextBar />
      </div>
    </div>
  );
};
