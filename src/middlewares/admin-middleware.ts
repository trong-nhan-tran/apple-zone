import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/libs/supabase";
import { cookies } from "next/headers";
import { errorResponse } from "@/libs/api-response";

export async function adminAuthMiddleware(req: NextRequest) {
  try {
    // const cookieStore = cookies();
    // const supabaseAccessToken = (await cookieStore).get(
    //   "sb-access-token"
    // )?.value;
    // const supabaseRefreshToken = (await cookieStore).get(
    //   "sb-refresh-token"
    // )?.value;

    // if (!supabaseAccessToken) {
    //   return NextResponse.json(errorResponse("Unauthenticated", 401), {
    //     status: 401,
    //   });
    // }

    // // Set session
    // const { data: sessionData, error: sessionError } =
    //   await supabase.auth.setSession({
    //     access_token: supabaseAccessToken,
    //     refresh_token: supabaseRefreshToken || "",
    //   });

    // if (sessionError || !sessionData.session) {
    //   return NextResponse.json(errorResponse("Invalid session", 401), {
    //     status: 401,
    //   });
    // }

    // // Lấy user
    // const { data: userData, error: userError } = await supabase.auth.getUser();

    // if (userError || !userData.user) {
    //   return NextResponse.json(errorResponse("User not found", 401), {
    //     status: 401,
    //   });
    // }

    // const userId = userData.user.id;

    // // Truy vấn role từ bảng profiles
    // const { data: profile, error: profileError } = await supabase
    //   .from("profiles")
    //   .select("role")
    //   .eq("id", userId)
    //   .single();

    // if (profileError || !profile) {
    //   return NextResponse.json(errorResponse("User profile not found", 403), {
    //     status: 403,
    //   });
    // }

    // const isAdmin = profile.role === "admin";

    // if (!isAdmin) {
    //   return NextResponse.json(
    //     errorResponse("Forbidden: Admin access required", 403),
    //     { status: 403 }
    //   );
    // }

    return null; // Allow access
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    return NextResponse.json(errorResponse("Authentication error", 500), {
      status: 500,
    });
  }
}
