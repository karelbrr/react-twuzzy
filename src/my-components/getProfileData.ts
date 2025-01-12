import { supabase } from "./createClient";
import { User } from "src/my-components/types.tsx";



  export const getProfileData = async (id: string | undefined): Promise<User> => {
    // Dotaz na uživatele
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
  
    if (profileError) {
      throw new Error(profileError.message);
    }
  
    // Dotaz na odznaky
    const { data: badgeData, error: badgeError } = await supabase
      .from("user_badges")
      .select("*,badges!badge_id (id, name)") // Přidán vztah na "badges"
      .eq("user_id", id);
  
    if (badgeError) {
      throw new Error(badgeError.message);
    }
  
    // Vrácení dat v očekávaném formátu
    return {
      ...profileData,
      badges: badgeData || [],
    };
  };
  


