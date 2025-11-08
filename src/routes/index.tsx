import { createFileRoute, redirect } from '@tanstack/react-router'
import { LocalStorageKeys } from '@/lib/utils/local-storage-helpers'
import { getDefaultRoute } from '@/lib/utils/route-helpers'
import Header from '@/lib/components/landing/Header'
import Hero from '@/lib/components/landing/Hero'
import Features from '@/lib/components/landing/Features'
import Pricing from '@/lib/components/landing/Pricing'
import Testimonials from '@/lib/components/landing/Testimonials'
import FAQ from '@/lib/components/landing/FAQ'
import Contact from '@/lib/components/landing/Contact'
import Footer from '@/lib/components/landing/Footer'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const user = localStorage.getItem(LocalStorageKeys.USER)
    const refreshToken = localStorage.getItem('refresh_token')
    if (user && refreshToken) {
      throw redirect({ to: getDefaultRoute(), replace: true })
    }
  },
  component: LandingPage,
})

function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </>
  )
}
