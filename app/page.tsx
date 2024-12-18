import Dashboard from "@/components/Dashboard";
import RegisterForm from "@/components/RegisterForm";
import { getUserFromCookie } from "@/lib/authenticateCookies/getUser";

export default async function Home() {
  const user = await getUserFromCookie();

  return (
    <>
      {user && <Dashboard user={user}/>}
      {!user && (
        <>
          <p className="text-center text-2xl text-gray-600 mb-5">
            Dont have an account? <strong>Create one</strong>
          </p>
          <RegisterForm />
        </>
      )}
    </>
  );
}
