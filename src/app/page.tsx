import { createClient } from '@/lib/supabase/server'
import { DashboardContent } from '@/features/dashboard'
import LandingNav from './_components/landing/LandingNav'
import HeroSection from './_components/landing/HeroSection'
import FeaturesSection from './_components/landing/FeaturesSection'
import HowItWorksSection from './_components/landing/HowItWorksSection'
import PricingSection from './_components/landing/PricingSection'
import TestimonialsSection from './_components/landing/TestimonialsSection'
import CtaBanner from './_components/landing/CtaBanner'
import LandingFooter from './_components/landing/LandingFooter'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen">
        <LandingNav />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <CtaBanner />
        <LandingFooter />
      </div>
    )
  }

  return <DashboardContent />
}
