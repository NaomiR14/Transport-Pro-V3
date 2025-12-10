// app/page.tsx - Solo agrega la lógica de usuario al inicio
import { createClient } from '@/lib/supabase/server'
import DashboardContent from './dashboard-content'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <DashboardContent user={user} />
}