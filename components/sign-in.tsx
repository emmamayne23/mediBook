import { signIn } from "@/auth";

export default async function SignIn() {
  // const session = await auth()
  // const user = session?.user
  // // console.log(user)
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit" className="cursor-pointer">
          Signin with Google
        </button>
      </form>
    </div>
  );
}
