// app/api/image/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(request: NextRequest) {
  try {
    const { filePaths } = await request.json();

    if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
      return NextResponse.json(
        { success: false, error: "No file paths provided" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.storage
      .from("images")
      .remove(filePaths);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      deletedCount: data?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
