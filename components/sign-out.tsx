import { signOut } from "@/auth";

export async function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="cursor-pointer px-4 py-2 rounded-xl text-center duration-300 bg-red-600/60 hover:bg-red-600/40"
      >
        Sign Out
      </button>
    </form>
  );
}
