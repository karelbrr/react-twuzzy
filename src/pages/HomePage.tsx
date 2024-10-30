import { Content } from "../my-components/Content";
import { SideBar } from "../my-components/SideBar";
import { TextBar } from "../my-components/TextBar";
import { UpperBar } from "../my-components/UpperBar";

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
