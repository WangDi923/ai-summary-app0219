import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // 确保路径指向你的 supabase.ts

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. 将文件读入内存（Buffer）
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. 直接上传到 Supabase Storage (不再调用 fs 模块)
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("documents") // 确保你在 Supabase 创建了名为 documents 的 bucket
      .upload(`uploads/${fileName}`, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error("Supabase storage error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Upload successful",
      path: data.path
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({
      error: "Upload failed"
    }, { status: 500 });
  }
}