import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HomePage from './(public)/page'

export default function RootPage() {
  return (
    <>
      <Navbar />
      <main>
        <HomePage />
      </main>
      <Footer />
    </>
  )
}
