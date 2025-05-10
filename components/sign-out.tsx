"use server"

import { signOut } from "@/auth";

export default async function SignOut() {
  return (
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
  );
}
