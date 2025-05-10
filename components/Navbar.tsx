import { ModeToggle } from "./toggle-mode";
import { auth, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";

import logo from "@/public/logo.png";
export default async function Navbar() {
  const session = await auth();
  const user = session?.user;
  // console.log(user);
  return (
    <nav className="z-50 bg-background flex justify-between items-center shadow-md p-3 gap-3 fixed top-0 right-0 left-0">
      <Link href={"/"} className=" bg-blue-600 px-1.5 md:px-3 rounded-sm">
        <Image src={logo} alt="logo" width={200} height={100}></Image>
      </Link>
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="cursor-pointer border-2 px-3 py-1.5 rounded-lg"
              >
                Signout
              </button>
            </form>
            <Link
              href={""}
              className="rounded-full flex justify-center items-center shadow-md"
            >
              {user.image ? (
                <Image
                  src={user.image || ""}
                  width={30}
                  height={30}
                  alt={user.name || ""}
                  className="rounded-full border"
                />
              ) : (
                <div className="font-semibold text-xl px-[8px] py-0.5 bg-blue-600 text-white rounded-full">
                  {(user.name?.[0] ?? "").toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        ) : (
          <Link href={"/sign-in"}>Sign In</Link>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
}
