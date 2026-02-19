import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ===============================
// POST /api/upload
// ===============================
export async function POST(req: Request) {

  try {

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ===============================
    // 读取文件内容
    // ===============================
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const textContent = buffer.toString("utf-8");

    // ===============================
    // 创建 uploads 文件夹（如果不存在）
    // ===============================
    const uploadDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // ===============================
    // 保存为 document.txt
    // ===============================
    const filePath = path.join(uploadDir, "document.txt");

    fs.writeFileSync(filePath, textContent);

    return NextResponse.json({
      message: "Upload successful"
    });

  } catch (error) {

    console.error("Upload error:", error);

    return NextResponse.json({
      error: "Upload failed"
    }, { status: 500 });
  }
}
