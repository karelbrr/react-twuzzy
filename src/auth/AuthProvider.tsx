import { supabase } from "@/my-components/my-hooks/createClient";
import { Session, User } from "@supabase/supabase-js";
import { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext<{
  session: Session | null | undefined;
  user: User | null | undefined;
  signOut: () => void;
  signInWithGitHub: () => void;
  signInWithDiscord: () => void;
}>({ session: null, user: null, signOut: () => {}, signInWithGitHub: () => {},signInWithDiscord: () => {} });

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>();
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(session);
      setUser(session?.user);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user);
        setLoading(false);
      }
    );

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };

    
  }, []);
  
  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
      });
      if (error) throw error; 
    } catch (err) {
      console.error("Error signing in with GitHub:", err); 
    } finally {
    }
  };

  const signInWithDiscord = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
      });
      if (error) throw error; 
    } catch (err) {
      console.error("Error signing in with Discord:", err); 
    } finally {
      
    }
  };

  const value = {
    session,
    user,
    signOut: () => supabase.auth.signOut(),
    signInWithGitHub,
    signInWithDiscord
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
