import { useAuth } from "@/auth/AuthProvider";
import { Content } from "../my-components/Content";
import { SideBar } from "../my-components/SideBar";
import { TextBar } from "../my-components/TextBar";
import { UpperBar } from "../my-components/UpperBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/my-components/createClient";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";


interface FirstLogin {
  id: string;
  first_login: boolean;
}

export const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook pro získání aktuální URL

  const fetchUserData = async (): Promise<FirstLogin> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,first_login")
      .eq("id", user?.id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  };

  const {
    data,
    error,
    isLoading,
    refetch, 
  } = useQuery<FirstLogin, Error>({
    queryKey: ["profileData", user?.id], 
    queryFn: fetchUserData,
    refetchOnWindowFocus: true, 
    refetchInterval: false, 
  });

 
  useEffect(() => {
   
    refetch(); 
  }, [location, refetch]); 

  
  useEffect(() => {
    if (data?.first_login) {
      navigate("/first_login", { replace: true });
    }
  }, [data, navigate]);

  return (
    <div className="h-screen ">
     

      {!data?.first_login && (
        <div>
          <SideBar />
          <div className="flex flex-col items-end h-screen">
            <UpperBar />
            <Content />
            <TextBar />
          </div>
        </div>
      )}
    </div>
  );
};
