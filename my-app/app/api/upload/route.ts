import { NextResponse } from 'next/server'

import { supabase } from '@/lib/supabase'
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // 1. 将文件转换为 ArrayBuffer (在内存中处理)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 2. 直接将内存中的 Buffer 上传到 Supabase
    // 删掉所有涉及到本地写入（如 fs.writeFile）的代码
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(`uploads/${Date.now()}-${file.name}`, buffer, {
        contentType: file.type, // 建议加上文件类型
        upsert: false
      })

    if (error) {
      console.error('Supabase error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Upload successful",
      path: data.path
    })
    
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}