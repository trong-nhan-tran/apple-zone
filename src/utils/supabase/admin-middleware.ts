import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/libs/api-response";
import { createClient } from "@/utils/supabase/server";

export async function adminAuthMiddleware(req: NextRequest) {
  const supabase = await createClient();
  try {
    // Get user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("Session error:", sessionError);
      return NextResponse.json(errorResponse("Unauthenticated", 401), {
        status: 401,
      });
    }

    const userId = session?.user.id;

    // Check user role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(errorResponse("User profile not found", 403), {
        status: 403,
      });
    }

    const isAdmin = profile.role === "admin";

    if (!isAdmin) {
      return NextResponse.json(
        errorResponse("Forbidden: Admin access required", 403),
        { status: 403 }
      );
    }

    return null; // Allow access
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    return NextResponse.json(errorResponse("Authentication error", 500), {
      status: 500,
    });
  }
}
