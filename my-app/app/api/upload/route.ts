import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // ===============================
    // 读取文件
    // ===============================
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer); // ⭐关键

    // ===============================
    // 上传到 Supabase Storage
    // ===============================
    const { data, error } = await supabase.storage
      .from("documents")
      .upload("document.txt", buffer, {
        contentType: "text/plain",
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw error;
    }

    console.log("Upload success:", data);

    return NextResponse.json({
      message: "Upload successful",
    });

  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
