import { useAuth } from "@/auth/AuthProvider";
import { SideBar } from "../my-components/SideBar";
import { UpperBar } from "../my-components/UpperBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/my-components/my-hooks/createClient";
import { Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface FirstLogin {
  id: string;
  first_login: boolean;
}

export const HomePage = () => {
  
  return (
    <div className="h-screen ">
      <Helmet>
        <title>Home | Twüzzy</title>
      </Helmet>
      {!isPending && (
        <div>
          <SideBar />
          <div className="flex flex-col items-end h-screen">
            <UpperBar />
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};
