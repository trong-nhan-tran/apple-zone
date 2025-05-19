"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});
export async function login(prevState: any, formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    return { error: "Invalid form data" };
  }

  const { email, password } = result.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email or password is incorrect" };
  }
  redirect("/admin/overview");
  revalidatePath("/", "layout");

  return { success: true };
}
export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: "Logout failed" };
  }

  revalidatePath("/", "layout");
  redirect("/admin/login");
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return { error: "Failed to fetch user" };
  }

  if (!user) {
    return { error: "User not found" };
  }

  const userId = user.id;
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (profileError) {
    return { error: "Failed to fetch profile" };
  }

  const { email } = user;
  const { full_name, avatar_url } = profile || {};
  return { email, full_name, avatar_url };
}

import { Provider } from "@supabase/supabase-js";

export async function loginWithOAuth(provider: Provider) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/overview`,
    },
  });

  if (error) {
    return { error: "Login failed" };
  }

  revalidatePath("/", "layout");
  redirect("/admin/overview");
}
// export async function signup(formData: FormData) {
//   const supabase = await createClient();

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//   };

//   const { error } = await supabase.auth.signUp(data);

//   if (error) {
//     redirect("/error");
//   }

//   revalidatePath("/", "layout");
//   redirect("/admin/private");
// }
