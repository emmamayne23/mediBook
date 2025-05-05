import { ModeToggle } from "./toggle-mode";
import { auth, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";

import logo from "@/public/logo.png"
export default async function Navbar() {
  const session = await auth();
  const user = session?.user;
//   console.log(user);
  return (
    <nav className="flex justify-between items-center shadow-md p-3 gap-3 border bg-green-700">
      <Link href={"/"}>
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
              <button type="submit" className="cursor-pointer">
                Signout
              </button>
            </form>
            <Link href={""}>
              <Image
                src={user.image || ""}
                width={30}
                height={30}
                alt={user.name || ""}
                className="rounded-full"
              />
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
