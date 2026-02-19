import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST() {
  try {

    // ===============================
    // 1️⃣ 找到 uploads 文件夹
    // ===============================
    const uploadDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json(
        { error: "Uploads folder not found." },
        { status: 400 }
      );
    }

    // ===============================
    // 2️⃣ 获取最新上传文件
    // ===============================
    const files = fs.readdirSync(uploadDir);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No uploaded document found. Please upload a file first." },
        { status: 400 }
      );
    }

    // 取最后上传的文件
    const latestFile = files[files.length - 1];
    const filePath = path.join(uploadDir, latestFile);

    // ===============================
    // 3️⃣ 读取文件内容
    // ===============================
    const fullText = fs.readFileSync(filePath, "utf-8");

    // ⭐⭐⭐ 关键修复：限制文本长度 ⭐⭐⭐
    // DeepSeek token 上限限制，必须截断
    const MAX_CHARS = 12000;

    const documentText =
      fullText.length > MAX_CHARS
        ? fullText.slice(0, MAX_CHARS)
        : fullText;

    // ===============================
    // 4️⃣ 调用 DeepSeek API
    // ===============================
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant that summarizes uploaded documents clearly for students.",
            },
            {
              role: "user",
              content: `
Please summarize the uploaded document.

Requirements:
- Clear explanation
- Bullet points
- Easy for students to understand
- Focus on key ideas only

Document:
${documentText}
              `,
            },
          ],
          temperature: 0.3,
        }),
      }
    );

    // ===============================
    // 5️⃣ API 错误检查（非常重要）
    // ===============================
    const text = await response.text();

    if (!response.ok) {
      console.error("DeepSeek API ERROR:");
      console.error(text);

      return NextResponse.json(
        { error: "DeepSeek API request failed." },
        { status: 500 }
      );
    }

    const data = JSON.parse(text);

    // ===============================
    // 6️⃣ 返回 summary
    // ===============================
    const summary =
      data.choices?.[0]?.message?.content || "No summary generated.";

    return NextResponse.json({ summary });

  } catch (error) {
    console.error("Summarize error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
