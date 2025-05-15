import { supabase } from "@/libs/supabase";
import prisma from "@/libs/prisma";

export async function getUserProfile(userId: string) {
  // Lấy thông tin user từ Supabase Auth
  const { data: authUser, error: authError } =
    await supabase.auth.admin.getUserById(userId);

  if (authError || !authUser) {
    throw new Error("User not found");
  }

  //   // Lấy thông tin profile từ Prisma
  //   const userProfile = await prisma.user.findUnique({
  //     where: { auth_id: userId },
  //     // include: {
  //     //   orders: true
  //     // }
  //   });

  //   return {
  //     auth: authUser,
  //     profile: userProfile
  //   };
}

// Đăng nhập bằng email và mật khẩu
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Đăng ký tài khoản mới
export async function signUpWithEmail(
  email: string,
  password: string,
  userData: any = {}
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // Tạo profile user trong Prisma sau khi đăng ký thành công
  if (data.user) {
    await prisma.user.create({
      data: {
        auth_id: data.user.id,
        email: data.user.email || "",
        name: userData.name || "",
        // Thêm các trường khác nếu cần
      },
    });
  }

  return data;
}

// Đăng xuất
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

// Lấy thông tin người dùng hiện tại
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

// Đăng nhập với OAuth (Google, Facebook, GitHub, v.v.)
export async function signInWithOAuth(
  provider: "google" | "facebook" | "github"
) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
