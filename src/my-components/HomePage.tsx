import { useAuth } from "@/auth/AuthProvider";
import { SideBar } from "./Sidebar";
import { UpperBar } from "./UpperBar";

export const HomePage = () => {
  const { signOut } = useAuth();

  return (
    <div className="h-screen ">
      <SideBar />
      <div className="flex justify-end">
        <UpperBar />
      </div>

      <div> 
        <button onClick={signOut} className="ml-96">logout</button>
      </div>
      
    </div>
  );
};
