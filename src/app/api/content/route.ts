import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase.from('site_content').select('key, value')
    const content: Record<string, string> = {}
    data?.forEach(r => { if (r.key) content[r.key] = r.value || '' })
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({})
  }
}
