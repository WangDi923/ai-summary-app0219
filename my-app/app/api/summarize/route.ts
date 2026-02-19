import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  try {

    // ===============================
    // 1️⃣ 从 Supabase 读取文件
    // ===============================
    const { data, error } = await supabase.storage
      .from("documents")
      .download("document.txt");

    if (error || !data) {
      return NextResponse.json(
        { error: "No uploaded document found." },
        { status: 400 }
      );
    }

    const fullText = await data.text();

    // 限制长度（防 token 爆炸）
    const MAX_CHARS = 12000;

    const documentText =
      fullText.length > MAX_CHARS
        ? fullText.slice(0, MAX_CHARS)
        : fullText;

    // ===============================
    // 2️⃣ 调用 DeepSeek
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
              content: `Summarize this document:\n\n${documentText}`,
            },
          ],
          temperature: 0.3,
        }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error(text);
      throw new Error("DeepSeek API failed");
    }

    const json = JSON.parse(text);

    const summary =
      json.choices?.[0]?.message?.content ??
      "No summary generated.";

    return NextResponse.json({ summary });

  } catch (error) {
    console.error("Summarize error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
