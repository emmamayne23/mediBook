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
        className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 text-red-600 dark:text-red-300 dark:hover:from-red-800 dark:hover:to-red-900 duration-300 font-bold py-2 px-5 rounded-xl cursor-pointer"
      >
        Sign Out
      </button>
    </form>
  );
}
