import { useAuth } from "@/auth/AuthProvider";



export const HomePage = () => {
  const { signOut } = useAuth()


  return (
    <div>
      <h1>home</h1>
      <button onClick={signOut}>logout</button>
    </div>
  );
};
