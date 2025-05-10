"use server"

import { signIn } from "@/auth";

export async function handleSignUp(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });
  
  const data = await response.json();
  
  if(!response.ok) {
    console.error(data.error || "Sign up failed");
    return;
  }
  
  await signIn("credentials", { email, password, redirectTo: "/" });
  console.log("Authentication failed without redirect");
}

 export async function handleSignin(formData: FormData) {

    const email = formData.get("email") as string
    const password = formData.get("password") as string
      // 1st option
      // await signIn("credentials", { email, password, redirectTo: "/" })

      // 2nd option
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if(!response.ok) {
        console.error(data.error || "Sign in failed");
        return;
      }
      await signIn("credentials", { email, password, redirectTo: "/" })
      console.log("Authentication failed without redirect")
  }


export async function handleGoogleSignIn() {
  await signIn("google", { redirectTo: "/" });
}
