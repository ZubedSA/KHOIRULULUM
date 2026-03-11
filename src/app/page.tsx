import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile to determine redirect
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile) {
    switch (profile.role) {
      case 'admin':
        redirect('/admin')
      case 'guru':
        redirect('/akademik')
      case 'bendahara':
        redirect('/keuangan')
    }
  }

  // Default redirect
  redirect('/login')
}
