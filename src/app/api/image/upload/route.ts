// app/api/image/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "products";

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}`;
        const fileExt = file.name.split(".").pop();
        const filePath = `${folder}/${fileName}.${fileExt}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        const { error } = await supabase.storage
          .from("images")
          .upload(filePath, buffer, {
            contentType: file.type,
            cacheControl: "3600",
            upsert: false,
          });

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(filePath);

        return publicUrl;
      })
    );

    return NextResponse.json({
      success: true,
      url: uploadResults,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
