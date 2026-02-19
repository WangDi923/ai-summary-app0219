import { createClient } from '@supabase/supabase-js'

export const getSupabase = () => {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY

  // 如果变量不存在（比如构建阶段），返回一个临时的假客户端
  // 这样构建就不会报错，真正的变量会在网站运行时生效
  if (!url || !key) {
    return createClient('https://placeholder.supabase.co', 'placeholder')
  }

  return createClient(url, key)
}