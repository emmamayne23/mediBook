

import { ModeToggle } from "./toggle-mode";
import { auth, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";

export async function Auth() {
  const session = await auth();
  const user = session?.user;
  // console.log(user);
  return (
    <div className="flex items-center gap-3">
      {user ? (
        <div className="flex items-center gap-3">
          <form
            action={async () => {
              "use server"
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
  );
}
