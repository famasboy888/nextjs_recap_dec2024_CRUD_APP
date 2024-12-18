import { logout } from "@/actions/userController";
import { getUserFromCookie } from "@/lib/authenticateCookies/getUser";
import Link from "next/link";

export default async function Header() {
  const user = await getUserFromCookie();
  return (
    <header className="bg-gray-100 shadow-md">
      <div className="container mx-auto">
        <div className="navbar">
          <div className="flex-1">
            <Link href={"/"} className="btn btn-ghost text-xl">
              HAIKUapp
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              {!user && (
                <li>
                  <Link href={"/login"}>Login</Link>
                </li>
              )}
              {user && (
                <>
                  <li>
                    <Link className="mr-3 btn" href={"/create-haiku"}>Create Haiku</Link>
                  </li>
                  <li>
                    <form className="btn btn-neutral" action={logout}>
                      <button type="submit">Logout</button>
                    </form>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
