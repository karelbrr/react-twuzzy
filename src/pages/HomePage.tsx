import { useAuth } from "@/auth/AuthProvider";
import { SideBar } from "../my-components/SideBar";
import { UpperBar } from "../my-components/UpperBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/my-components/my-hooks/createClient";
import { Outlet, useNavigate } from "react-router-dom";

interface FirstLogin {
  id: string;
  first_login: boolean;
}

export const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchUserData = async (): Promise<FirstLogin> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,first_login")
      .eq("id", user?.id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  };

  const { data, isPending } = useQuery<FirstLogin, Error>({
    queryKey: ["profileData", user?.id],
    queryFn: fetchUserData,
    refetchOnWindowFocus: true,
  });

  if (data?.first_login) {
    navigate("/first_login");
  }

  return (
    <div className="h-screen ">
      {!isPending && (
        <div>
          <SideBar />
          <div className="flex flex-col items-end h-screen">
            <UpperBar />
            <Outlet/>
          </div>
        </div>
      )}
    </div>
  );
};
